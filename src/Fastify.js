/**
 * @author Danny van Lierop
 * @description Mirror hue bridge values to external source to offload bridge requests or make them available to other networks
 * @license MIT
 * @JS_dependency config.js, HueApi.js
 */

/** https://www.sitepoint.com/create-rest-api-fastify/ **/

module.exports = function()
{ 
    this.fastify = require('fastify')({ /** instantiate fastify framework **/
        logger: config.Fastify.Logger /** enable/disable logging **/
    }),
    this.fastify.get('/', async (request, reply) => { /** fastify - declare a default route for debug **/
        reply.send("Hello World3!");
    }),
    this.fastify.setErrorHandler((error, reply) => { /** fastify - declare Error handler **/
        error.message = JSON.parse(error.message);
        reply.send(error);
    }),
    FastifyServerStart = async () => { /** fastify - run the http-server! **/
        try { /** anonymous function : () => same as function(){} - Example: this.start = async function(){} **/
            await fastify.listen({port : config.Fastify.Port, host : config.Fastify.IP}, (err, address) => { /** start http server listening - https://www.fastify.io/docs/latest/Reference/Server/#:~:text=%C2%B6-,listen,-Starts%20the%20server **/
                console.log(`Server is now listening on ${address}`);
            });
        } catch (err) { /** catch http-server error **/
            fastify.log.error(err); /** log http-server error **/
            process.exit(1); /** stop script on http-server error **/
        };
    },
    FastifyServerStart(); /** start http-server **/

    //Declare more Fastify routes after

    // Hue lights
    fastify.get('/api/'+ config.Hue.Bridge.User +'/lights/', (request, reply) => { /** declare HTTP-server route to fetch all lights **/
        reply.send(hueBridgeStateLight); /** return full lights object **/
    });
    fastify.get('/api/'+ config.Hue.Bridge.User +'/lights/:params/', (request, reply) => { /** declare HTTP-server route to fetch one lights **/
        let lightNumber = Object.values(request.params)[0]; /** get lightnumber from url request params **/
        reply.send(hueBridgeStateLight[lightNumber]); /** return object[lightnumber] **/
    });

    // Hue sensors
    fastify.get('/api/'+ config.Hue.Bridge.User +'/sensors/', (request, reply) => { /** declare HTTP-server route to fetch all sensors **/
        reply.send(hueBridgeSensor); /** return full sensors object **/
    });
    fastify.get('/api/'+ config.Hue.Bridge.User +'/sensors/:params/', (request, reply) => { /** declare HTTP-server route to fetch one sensors **/
        let sensorNumber = Object.values(request.params)[0]; /** get sensorNumber from url request params **/
        reply.send(hueBridgeSensor[sensorNumber]["data"]); /** return object[sensorNumber] **/
    });
};