/**
 * @author Danny van Lierop
 * @description Mirror hue bridge values to external source to offload bridge requests or make them available to other networks
 * @license MIT
 * @JS_dependency config.js, Terminal_Colors.js
 */

module.exports = function()
{
    //Global
    this.timeMillisEpoch  = new Date().getTime();                                                                       /** milliseconds elapsed since the UNIX epoch **/
    this.TimeMillisOnline = function(){return new Date().getTime() - timeMillisEpoch;};                                 /** milliseconds elapsed since start script **/

    //Local
    this.hueBridgeStateLight  = {};                                                                                     /** contains all light state values found in bridge -> "{"1":{},"2":{}}" **/
    this.hueBridgeSensor = {};                                                                                          /** contains all sensor state values found in bridge -> "{"1":{},"2":{}}" **/
                                                                                                                        /** https://github.com/peter-murray/node-hue-api/tree/main/examples/v3 **/
    this.v3 = require('node-hue-api').v3;                                                                               /**  <-- If using this code outside the "node-hue-api" library  **/
    //const v3 = require('../../../index').v3;                                                                          /** <-- If using this code inside the "node-hue-api" library **/
    this.bridgeConnect = v3.api.createLocal(config.Hue.Bridge.IP).connect(config.Hue.Bridge.User);                      /** connect once to the hue bridge at start **/

    this.ObjCompare = async function(item, objectCur,objectUpdate){
        function LogItem(obj) //Don't log these items
        {
            //Skip hue sensors
            if(Number(JSON.stringify(obj)) > 32 && Number(JSON.stringify(obj)) < 69 || Number(JSON.stringify(obj)) > 71)return false
            return true;
        };
        if(JSON.stringify(objectCur) !== JSON.stringify(objectUpdate)){
            //Log key
            if(LogItem(item.data.id))process.stdout.write(`\n[${item.data.id}][${item.data.name}]\t`);
            
            var keyName = Object.keys(objectUpdate);
            for (var keyPos = 0; keyPos < keyName.length; keyPos++){
                if(LogItem(item.data.id)){
                    process.stdout.write(`\t${keyName[keyPos]}: `); // Log ItemName
                    var statusColor="Green"; if(objectCur[keyName[keyPos]] === objectUpdate[keyName[keyPos]])statusColor="Dim";
                    process.stdout.write(`${ Color(statusColor, JSON.stringify(objectUpdate[keyName[keyPos]]) ) }`); //Log New value
                };
                objectCur[keyName[keyPos]]=objectUpdate[keyName[keyPos]]; // Save update
            };
        ;}
    };

    this.bridgeGetLightAll = async function() {                     /** gets state of all lights from bridge **/
        bridgeConnect.then(api => { return api.lights.getAll();     /** get all light states */ })
        .then(allLights => {
            allLights.forEach(item => { /** iterate over the items object **/
                if(item.data.id !== 'undefined'){ /** item got id **/
                    if(typeof(hueBridgeStateLight[item.data.id]) === 'undefined'){ /** don't compare before its saved at least once **/
                        process.stdout.write(`\n[${item.data.id}][${item.data.name}][${item.data.type}][${item.data.modelid}]`);
                        hueBridgeStateLight[item.data.id]=item; /** save full item data to our local object **/ //process.stdout.write(`initialized`);
                    } else { /** searchUpdates - compare new values against current **/
                        ObjCompare(item, hueBridgeStateLight[item.data.id]["data"]["state"],item["data"]["state"]);
                    }; //delete objectCur[item.data.id]["data"]["type"]; delete objectCur[item.data.id]["data"]["id"];   /** delete id in local object, not existing on bridge **/
                };
            })/** allLights.forEach **/;
        })
        .catch(err => { /** catch fetch errors **/
            console.error(err);
        });
        return;
    }/** this.bridgeGetLightAll **/;

    this.bridgeGetSensorAll = async function() {                        /** gets state of all sensors from bridge **/
        this.bridgeConnect.then(api => { return api.sensors.getAll();   /** get all sensor states */ })
        .then(allSensors => {
            allSensors.forEach(item => { /** iterate over the items object **/
                if(item.data.id !== 'undefined'){ /** item got id **/
                    if(typeof(hueBridgeSensor[item.data.id]) === 'undefined'){ /** don't compare before its saved at least once **/
                        process.stdout.write(`\n[${item.data.id}][${item.data.name}][${item.data.type}][${item.data.modelid}]`);
                        hueBridgeSensor[item.data.id]=item; /** save full item data to our local object **/ //process.stdout.write(`initialized`);
                    } else { /** searchUpdates - compare new values against current **/
                        ObjCompare(item,hueBridgeSensor[item.data.id]["data"]["state"],item["data"]["state"]);
                    }; //delete objectCur[item.data.id]["data"]["type"]; delete objectCur[item.data.id]["data"]["id"];   /** delete id in local object, not existing on bridge **/
                };
            })/** allSensors.forEach **/;
        })
        .catch(err => { /** catch fetch errors **/
            console.error(err);
        });
        return;
    }/** this.bridgeGetSensorAll **/;

    this.Handler_Lights  = {
        msIntervalCur  : config.Hue.Bridge.Lights.msIntervalCur,                                                        /** milliseconds interval between running function **/
        msNext         : 0,                                                                                             /** milliseconds starting next run **/
        AutoFetchAll: async function () {                                                                               /** Function that loops endless and checks when to run task **/
            if (TimeMillisOnline() > Handler_Lights.msNext)                                                             /** Run when interval reached **/
            {
                await bridgeGetLightAll();                                                                              /** query bridge for values of all lights **/
                Handler_Lights.msNext = TimeMillisOnline()+Handler_Lights.msIntervalCur;                                /** when done, save current time plus interval for next run **/
                await new Promise(resolve => setTimeout(Handler_Lights.AutoFetchAll, 0));                               /** reset timer for next run, check again every new 1 ms **/
            } else {
                await new Promise(resolve => setTimeout(Handler_Lights.AutoFetchAll, Handler_Lights.msIntervalCur));    /** reset timer for next run check **/
            };
            return;
        }
    };

    this.Handler_Sensors  = {
        msIntervalCur  : config.Hue.Bridge.Sensors.msIntervalCur,                                                        /** milliseconds interval between running function **/
        msNext         : 0,                                                                                              /** milliseconds starting next run **/
        AutoFetchAll: async function () {                                                                                /** Function that loops endless and checks when to run task **/
            if (TimeMillisOnline() > Handler_Sensors.msNext)                                                             /** Run when interval reached **/
            {
                await bridgeGetSensorAll();                                                                              /** query bridge for values of all lights **/
                Handler_Sensors.msNext = TimeMillisOnline()+Handler_Sensors.msIntervalCur;                                /** when done, save current time plus interval for next run **/
                await new Promise(resolve => setTimeout(Handler_Sensors.AutoFetchAll, 0));                               /** reset timer for next run, check again every new 1 ms **/
            } else {
                await new Promise(resolve => setTimeout(Handler_Sensors.AutoFetchAll, Handler_Sensors.msIntervalCur));   /** reset timer for next run check **/
            };
            return;
        }
    };

    Promise.all([
                    Handler_Lights.AutoFetchAll(),
                    Handler_Sensors.AutoFetchAll()
                ])
};
//require('./HueAPI.js')(); /** **/