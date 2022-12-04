module.exports = function()
{
    this.config = {};

    config.Hue = {};

    config.Hue.Bridge = {};
    config.Hue.Bridge.User = "HUE_BRIDGE_USERNAME";
    config.Hue.Bridge.IP   = "HUE_BRIDGE_IP";

    config.Hue.Bridge.Lights = {};
    config.Hue.Bridge.Lights.msIntervalCur = 1000;  /** hue lights. interval between fetching updates**/

    config.Hue.Bridge.Sensors = {};
    config.Hue.Bridge.Sensors.msIntervalCur = 1000; /** hue sensors, interval between fetching updates**/

    config.Fastify = {};
    config.Fastify.Logger = false;                  /** fastify debug **/
    config.Fastify.Port   = 80;                     /** fastify http-server port **/
    config.Fastify.IP     = '127.0.0.1';            /** fastify hostip, 127.0.0.1 = (only localhost ipv4), 
                                                                          0.0.0.0 = (all interfaces ipv4), 
                                                                        localhost = (localhost ipv4 and ipv6 ), 
                                                                           hostip = (interface ipv4 or ipv6 ) **/
};