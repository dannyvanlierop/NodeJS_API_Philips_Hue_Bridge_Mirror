#!/usr/bin/node
/**
 * @author Danny van Lierop
 * @description Mirror hue bridge values to an external source to offload bridge requests or make them available to other networks.
 * @license MIT
 */

/** https://www.w3schools.com/js/js_async.asp **/

'use strict'; /** Using a variable, without declaring it, is not allowed **/

const colors = {   /** Colors for debug purpose **/
    //General
    Reset: "\x1b[0m", /** Use reset after stating a color, to reset the console back to normal mode **/
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",

    //Font Color
    Black: "\x1b[30m",      fgBlack: "\x1b[30m",        fgDarkGray: "\x1b[39m",
    Red: "\x1b[31m",        fgRed: "\x1b[31m",          fgLightRed: "\x1b[91m",
    Green: "\x1b[32m",      fgGreen: "\x1b[32m",        fgLightGreen: "\x1b[92m",
    Yellow: "\x1b[33m",     fgYellow: "\x1b[33m",       fgLightYellow: "\x1b[93m",
    Blue: "\x1b[34m",       fgBlue: "\x1b[34m",         fgLightBlue: "\x1b[94m",
    Magenta: "\x1b[35m",    fgMagenta: "\x1b[35m",      fgLightMagenta: "\x1b[95m",
    Cyan: "\x1b[36m",       fgCyan: "\x1b[36m",         fgLightCyan: "\x1b[96m",
    LightGray: "\x1b[37m",  fgLightGray: "\x1b[37m",    fgWhite: "\x1b[97m",
    Crimson: "\x1b[38m",    fgCrimson: "\x1b[38m",
                            fgDefault: "\x1b[39m",

    //Background Color
    bgBlack: "\x1b[40m",    bgDarkGray: "\x1b[100m",
    bgRed: "\x1b[41m",      bgLightRed: "\x1b[101m",
    bgGreen: "\x1b[42m",    bgLightGreen: "\x1b[102m",
    bgYellow: "\x1b[43m",   bgLightYellow: "\x1b[103m",
    bgBlue: "\x1b[44m",     bgLightBlue: "\x1b[104m",
    bgMagenta: "\x1b[45m",  bgLightMagenta: "\x1b[105m",
    bgCyan: "\x1b[46m",     bgLightCyan: "\x1b[106m",
    bgWhite: "\x1b[47m",
    bgCrimson: "\x1b[48m",
    bgDefault: "\x1b[49m",
};

function Color(color, text){ /** {String} color, {String} text, returns marked up text **/
    return( colors[color] + text + colors.Reset);
};

//var de = false; // true when debugging
//function bug( string ){ process.stdout.write(string); };
//de&&bug( "hello world")


var config = require('./config.json'); /** module configuration file, placed in parent directory of script directory **/
/** import config values **/
var bridgeFetchInterval = config.bridgeFetchIntervalMin;
var bridgeFetchIntervalMin = config.bridgeFetchIntervalMin;
var bridgeFetchIntervalMax = config.bridgeFetchIntervalMax;
var bridgeFetchIntervalIncrease = config.bridgeFetchIntervalIncrease;
var bridgeFetchIntervalDecrease = config.bridgeFetchIntervalDecrease;
var bridgeFetchIntervalUpdateCur = 0;

var bridgeFetchBusy = false; /** (true = fetching) (false = waiting for next fetch) **/
var bridgeFetchLast = 0 - bridgeFetchInterval; /** last run main function, ( - bridgeFetchInterval) always run once at start **/

var bridgeStateLight = {}; /** contains all light state values found in bridge -> "{"1":{},"2":{}}" **/

/** https://github.com/peter-murray/node-hue-api/tree/main/examples/v3 **/
//const v3 = require('../../../index').v3; /** <-- If using this code inside the "node-hue-api" library **/
const v3 = require('node-hue-api').v3; /**  <-- If using this code outside the "node-hue-api" library  **/

var timeMillisEpoch = new Date().getTime(); /** milliseconds elapsed since the UNIX epoch **/
function TimeMillisStart(){ return new Date().getTime() - timeMillisEpoch; }; /** milliseconds elapsed since start script **/

const bridgeConnect = v3.api.createLocal(config.bridgeIP).connect(config.bridgeUser); /** connect once to the hue bridge at start **/

//      async function BridgeGetLight(lightNumber){ /** get state of 1 light from bridge **/
//          bridgeConnect.then(api => {
//              return api.lights.getLight(lightNumber); /** get 1 light state */
//          })
//          .then(light => {
//              console.log(light.data.state.on); /** get on state **/
//          })
//          .catch(err => { /** catch fetch errors **/
//              console.error(err);
//          });
//          bridgeFetchBusy=false; /** fetch done **/
//          return;
//      };

var notDiffCounter = 0;

async function bridgeGetLightAll(){ /** get state of all lights from bridge **/
    //var diffCounter = 0;
    bridgeConnect.then(api => {
        return api.lights.getAll(); /** get all light states */
    })
    .then(allLights => {
        var diffCounter = 0;
        //console.log(allLights); /** display details of allLights **/
        if(!notDiffCounter)process.stdout.write("\n bridgeFetchInterval ->"); /** (scroll brake) Start a new line when last fetch had a changed value **/
        process.stdout.write(" [" + Color("Magenta",String(bridgeFetchInterval)) + "]");
        bridgeFetchIntervalUpdateCur += bridgeFetchInterval;
        //bridgeFetchIntervalUpdateCur = notDiffCounter?bridgeFetchInterval:bridgeFetchIntervalUpdateCur + bridgeFetchInterval;
        //
        allLights.forEach(light => { /** iterate over the lights object **/
            let lightNumber = light.data.id; /** fetch light number **/
            if(typeof(bridgeStateLight[lightNumber]) !== 'undefined'){ /** don't compare until saved at least once **/
                // ********************************************************************************************************
                /** only debug light 1 **/
                     //if(light.data.id == 1)
                     //{
                     //    if(debug)console.log(Color("Yellow", light.data.state.on)); /** get on/off state of light 1 **/
                     //};
                // ********************************************************************************************************
                /** local - Check data light 1 **/
                     //process.stdout.write(" Local: ");
                     //process.stdout.write(JSON.stringify(bridgeStateLight[lightNumber])); /** light (Full object) **/
                     //process.stdout.write(JSON.stringify(bridgeStateLight[lightNumber].state)); /** light (state) **/
                     //process.stdout.write(JSON.stringify(bridgeStateLight[lightNumber].state.on)); /** light (state.on) **/
                     //process.stdout.write(" <->");
                // ********************************************************************************************************
                /** bridge - Check data light 1 **/
                     //process.stdout.write(" Bridge: ");
                     //process.stdout.write(JSON.stringify(light.data)); /** light (Full object) **/
                     //process.stdout.write(JSON.stringify(light.data.state)); /** light (state) **/
                     //process.stdout.write(JSON.stringify(light.data.state.on)); /** light (state.on) **/ 
                // ********************************************************************************************************
                /** compare , before saving **/ 
                // ********************************************************************************************************
                /** compare "all keys" in light state, "bridge" <- vs -> "local", by predefine each key **/ 
                    //if(typeof(bridgeStateLight[lightNumber].state.on) !== 'undefined'){
                    //    process.stdout.write(" on:");
                    //    if( JSON.stringify(bridgeStateLight[lightNumber].state.on) === JSON.stringify(light.data.state.on))
                    //    {
                    //        process.stdout.write(JSON.stringify(light.data.state.on));
                    //    }
                    //    else
                    //    {
                    //        process.stdout.write(Color("Red",JSON.stringify(light.data.state.on)));
                    //    }
                    //};
                    //process.stdout.write(" bri:");
                    //if( JSON.stringify(bridgeStateLight[lightNumber].state.bri) === JSON.stringify(light.data.state.bri))
                    //{
                    //    process.stdout.write(JSON.stringify(light.data.state.bri));
                    //}
                    //else
                    //{
                    //    process.stdout.write(Color("Red",JSON.stringify(light.data.state.bri)));
                    //}
                    //process.stdout.write(" hue:");
                    //if( JSON.stringify(bridgeStateLight[lightNumber].state.hue) === JSON.stringify(light.data.state.hue))
                    //{
                    //    process.stdout.write(JSON.stringify(light.data.state.hue));
                    //}
                    //else
                    //{
                    //    process.stdout.write(Color("Red",JSON.stringify(light.data.state.hue)));
                    //}
                    //process.stdout.write(" x:");
                    //if( JSON.stringify(bridgeStateLight[lightNumber].state.xy[0]) === JSON.stringify(light.data.state.xy[0]))
                    //{
                    //    process.stdout.write(JSON.stringify(light.data.state.xy[0]));
                    //}
                    //else
                    //{
                    //    process.stdout.write(Color("Red",JSON.stringify(light.data.state.xy[0])));
                    //}
                    //process.stdout.write(" y:");
                    //if( JSON.stringify(bridgeStateLight[lightNumber].state.xy[1]) === JSON.stringify(light.data.state.xy[1]))
                    //{
                    //    process.stdout.write(JSON.stringify(light.data.state.xy[1]));
                    //}
                    //else
                    //{
                    //    process.stdout.write(Color("Red",JSON.stringify(light.data.state.xy[1])));
                    //}
                // ********************************************************************************************************
                /** compare "all keys" in light state, "bridge" <- vs -> "local", by Object.keys iteration **/
                    // 
                    //if( JSON.stringify(bridgeStateLight[lightNumber].state) === JSON.stringify(light.data.state))
                    //{
                    //    process.stdout.write("\n[" + String(lightNumber) + "]");
                    //}
                    //else
                    //{
                    //    process.stdout.write("\n[" + Color("Red",String(lightNumber)) + "]");
                    //};
                    //
                    //var srcKeys = Object.keys(bridgeStateLight[lightNumber].state);
                    //for (var i = 0; i < srcKeys.length; i++) {
                    //    process.stdout.write(" ");
                    //    
                    //    let srcKeyName = srcKeys[i];
                    //
                    //    if(typeof(bridgeStateLight[lightNumber].state[srcKeyName]) !== 'undefined'){
                    //        process.stdout.write(srcKeyName + ":");
                    //        if( JSON.stringify(bridgeStateLight[lightNumber].state[srcKeyName]) === JSON.stringify(light.data.state[srcKeyName]))
                    //        {
                    //            process.stdout.write(JSON.stringify(light.data.state[srcKeyName]));
                    //        }
                    //        else
                    //        {
                    //            process.stdout.write(Color("Red",JSON.stringify(light.data.state[srcKeyName])));
                    //        }
                    //    };
                    //};
                // ********************************************************************************************************
                /** compare "all keys" in light state "bridge" <- vs -> "local", by Object.keys iteration, and show only changed values**/
                if( JSON.stringify(bridgeStateLight[lightNumber].state) !== JSON.stringify(light.data.state))
                {
                    if(!diffCounter)process.stdout.write(" Found ->");
                    process.stdout.write(" [Light:" + Color("Yellow",String(lightNumber)) + "]");
                    var srcKeys = Object.keys(bridgeStateLight[lightNumber].state);
                    for (var i = 0; i < srcKeys.length; i++){
                        let srcKeyName = srcKeys[i];
                        if(typeof(bridgeStateLight[lightNumber].state[srcKeyName]) !== 'undefined'){
                            if( JSON.stringify(bridgeStateLight[lightNumber].state[srcKeyName]) !== JSON.stringify(light.data.state[srcKeyName]))
                            {
                                process.stdout.write(" " + srcKeyName + ":");
                                process.stdout.write(Color("Red",JSON.stringify(light.data.state[srcKeyName])));
                                diffCounter++;
                            };
                        };
                    };
                };
            };
            /** Save light state on bridge to local **/
            bridgeStateLight[light.data.id] = light.data; /** save light state to our local object **/
            delete bridgeStateLight[light.data.id].id; /** delete id in local object, not existing on bridge **/
        });/** light **/
        return diffCounter;
    })/** allLights **/
    .then(diffCounter => { /** change fetch delay **/
        if(diffCounter > 0){
            /** updates found - speed up fetching **/
            notDiffCounter = 0;
            bridgeFetchInterval -= diffCounter * config.bridgeFetchIntervalDecrease;//25
            process.stdout.write(" [Items:" + Color("Green",String(diffCounter)) + "]");
            
            process.stdout.write(" [Last update:" + Color("Cyan",String(bridgeFetchIntervalUpdateCur)) + "] ");

            bridgeFetchIntervalUpdateCur = 0;
        }
        else
        {
            /** no updates found - slow down fetching **/
            notDiffCounter++;
            bridgeFetchInterval += notDiffCounter * config.bridgeFetchIntervalIncrease;//5
        };
        if(diffCounter > 8)bridgeFetchInterval = bridgeFetchIntervalMin; /** Reset interval **/
        if(bridgeFetchInterval < bridgeFetchIntervalMin)bridgeFetchInterval = bridgeFetchIntervalMin; /** Keep interval above min interval **/
        if(bridgeFetchInterval > bridgeFetchIntervalMax)bridgeFetchInterval = bridgeFetchIntervalMax; /** Keep interval below max interval **/

    })
    .then(tmp => {
        bridgeFetchBusy=false; /** fetch done **/
    })
    .catch(err => { /** catch fetch errors **/
        console.error(err);
    })
    return;
};

async function main(){
    if( TimeMillisStart() - bridgeFetchLast > bridgeFetchInterval && !bridgeFetchBusy){ /** run when interval reached and not fetching values **/
        //process.stdout.write(`\nonline[${ Math.floor(TimeMillisStart()/1000)}sec] lastFetch[${ TimeMillisStart() - bridgeFetchLast }ms]`); /** Debug onlineSeconds and (fetch)intervalMillis **/
        bridgeFetchBusy=true; /** start fetching **/
        bridgeFetchLast = TimeMillisStart(); /** save current time, for next interval/run check **/
        
        //await BridgeGetLight(1); /** query bridge for values of 1 light **/
        await bridgeGetLightAll(); /** query bridge for values of all lights **/

        await new Promise(resolve => setTimeout(main,1)); /** reset timer for next fetch, check again every new 1 ms **/
    }
    else
    {
        await new Promise(resolve => setTimeout(main,bridgeFetchInterval)); /** reset timer for next fetch check **/
    };
    return;
};
main(); /** Start fetching **/

const fastify = require('fastify')({ /** instantiate fastify framework **/
    logger: config.fastifyLogger /** enable/disable logging **/
});

fastify.get('/api/'+ config.bridgeUser +'/lights/', (request, reply) => { /** declare HTTP-server route to fetch all lights **/
    //fastifyRequestCounter++; /** count http requests **/
    reply.send(bridgeStateLight); /** return full lights object **/
});

fastify.get('/api/'+ config.bridgeUser +'/lights/:params/', (request, reply) => { /** declare HTTP-server route to fetch one lights **/
    //fastifyRequestCounter++; /** count http requests **/
    let lightNumber = Object.values(request.params)[0]; /** get lightnumber from url request params **/
    reply.send(bridgeStateLight[lightNumber]); /** return object[lightnumber] **/
});

fastify.get('/', async (request, reply) => { /** fastify - declare a default route for debug **/
    reply.send("Hello World!");
});

fastify.setErrorHandler((error, reply) => { /** fastify - declare Error handler **/
    error.message = JSON.parse(error.message);
    reply.send(error);
});
  
const start = async () => { /** fastify - run the http-server! **/
    try {
        await fastify.listen(80,config.fastifyIPListen, (err, address) => { /** start http server listening **/
            console.log(`Server is now listening on ${address}`);
        });
    } catch (err) { /** catch http-server error **/
        fastify.log.error(err); /** log http-server error **/
        process.exit(1); /** stop script on http-server error **/
    };
};


//while(JSON.stringify(bridgeStateLight) === JSON.stringify({})){}; /** wait till bridgeStateLight got a value **/
start(); /** start http-server **/

