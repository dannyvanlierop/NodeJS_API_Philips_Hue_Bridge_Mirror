/**
 * @author Danny van Lierop (https:
 * @contributors Schmitzenbergh (https:
 * @description Mirror hue bridge values to external source to offload bridge requests or make them available to other networks
 * @license MIT
 * @dependencies fastify, follow-redirects, .config.json
 */
module.exports = {
    BridgeGetAll: doBridgeGetAll,
    BridgeGetSensor: doBridgeGetSensor,
    BridgeGetSensors: doBridgeGetSensors,
    BridgeGetLight: doBridgeGetLight,
    BridgeGetLights: doBridgeGetLights
};
var Bridge =
{
    Config: {
        User: require('./.config.json').BridgeUser,      /** hue bridge username **/
        IP: "10.0.0.99",                                     /** hue bridge ip **/
        Port: 80,
        Path: {
            Root: "/api/" + require('./.config.json').BridgeUser,
            Sensors: "/api/" + require('./.config.json').BridgeUser + "/sensors",
            Lights: "/api/" + require('./.config.json').BridgeUser + "/lights"
        },
        fastifyIP: '0.0.0.0',
        fastifyPort: 80,
        fastifyLogger: false,
        fastifyName: 'fastify_Bridge',
        AutoFetch: {
            Lights: {
                Interval: {
                    Cur: 1000,
                    Min: 0,
                    Max: 0,
                    Inc: 0,
                    Dec: 0
                },
            },
            Sensors: {
                Interval: {
                    Cur: 1000,
                    Min: 0,
                    Max: 0,
                    Inc: 0,
                    Dec: 0
                },
            },
        },
    },
    Data: {
        lights: {},
        groups: {},
        config: {},
        schedules: {},
        scenes: {},
        rules: {},
        sensors: {},
        resourcelinks: {}
    },
};
async function doBridgeGet(bridgeIP, bridgePath) {
    return await http.jsonGet(bridgeIP, Bridge.Config.Port, bridgePath);
};
async function doBridgeGetAll(bridgeIP) {
    return await doBridgeGet(bridgeIP, Bridge.Config.Path.Root)
        .then(function (retVal) { return Bridge.Data = retVal; });
};
async function doBridgeGetSensor(bridgeIP, sensorNumber) {
    return await doBridgeGet(bridgeIP, `${Bridge.Config.Path.Sensors}/${sensorNumber}`)
        .then(function (retVal) { return Bridge.Data.sensors[sensorNumber] = retVal; });
};
async function doBridgeGetSensors(bridgeIP) {
    return await doBridgeGet(bridgeIP, `${Bridge.Config.Path.Sensors}`)
        .then(function (retVal) { return Bridge.Data.sensors = retVal; });
};
async function doBridgeGetLight(bridgeIP, lightNumber) {
    return await doBridgeGet(bridgeIP, `${Bridge.Config.Path.Lights}/${lightNumber}`)
        .then(function (retVal) { return Bridge.Data.lights[lightNumber] = retVal; });
};
async function doBridgeGetLights(bridgeIP) {
    return await doBridgeGet(bridgeIP, `${Bridge.Config.Path.Lights}`)
        .then(function (retVal) { return Bridge.Data.lights = retVal; });
};
var lightsUpdateNext = 0;
async function doBridgeUpdateLights(bridgeIP) {
    var millisNow = await TimeMillisOnline();
    if (lightsUpdateNext < millisNow) {
        lightsUpdateNext = millisNow + (Bridge.Config.AutoFetch.Lights.Interval.Cur);
        await doBridgeGetLights(bridgeIP);
    };
    setTimeout(async () => { return await doBridgeUpdateLights(bridgeIP); }, await TimeMillisOnline() - lightsUpdateNext || 0);
};
var sensorsUpdateNext = 0;
async function doBridgeUpdateSensors(bridgeIP) {
    var millisNow = await TimeMillisOnline();
    if (sensorsUpdateNext < millisNow) {
        sensorsUpdateNext = millisNow + (Bridge.Config.AutoFetch.Sensors.Interval.Cur);
        await doBridgeGetSensors(bridgeIP);
    };
    setTimeout(async () => { return await doBridgeUpdateSensors(bridgeIP); }, await TimeMillisOnline() - sensorsUpdateNext || 0);
};
(async function () {
    require('./lib_Fastify.js')(Bridge.Config.fastifyIP,
        Bridge.Config.Port,
        Bridge.Config.fastifyLogger,
        Bridge.Config.fastifyName
    );
    this[`${Bridge.Config.fastifyName}`].get(`/api/${Bridge.Config.User}/`, (request, reply) => {
        reply.send(Bridge.Data);
    });
    this[`${Bridge.Config.fastifyName}`].get(`/api/${Bridge.Config.User}/sensors/`, (request, reply) => {
        reply.send(Bridge.Data.sensors);
    });
    this[`${Bridge.Config.fastifyName}`].get(`/api/${Bridge.Config.User}/sensors/:params/`, (request, reply) => {
        let itemPos = Object.values(request.params)[0];
        reply.send(Bridge.Data.sensors[itemPos]);
    });
    this[`${Bridge.Config.fastifyName}`].get(`/api/${Bridge.Config.User}/lights/`, (request, reply) => {
        reply.send(Bridge.Data.lights);
    });
    this[`${Bridge.Config.fastifyName}`].get(`/api/${Bridge.Config.User}/lights/:params/`, (request, reply) => {
        let itemPos = Object.values(request.params)[0];
        reply.send(Bridge.Data.lights[itemPos]);
    });
    setTimeout(async () => { return await doBridgeGetAll(Bridge.Config.IP); }, 0);
    setTimeout(async () => { return await doBridgeUpdateLights(Bridge.Config.IP); }, (Bridge.Config.AutoFetch.Lights.Interval.Cur));
    setTimeout(async () => { return await doBridgeUpdateSensors(Bridge.Config.IP); }, (Bridge.Config.AutoFetch.Sensors.Interval.Cur));
})();