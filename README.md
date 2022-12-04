# NodeJS_HueBridge-Mirror-API
Mirror hue bridge values to external source to offload bridge requests<br>

&nbsp;<br>
[
    ![Open source](
        https://img.shields.io/badge/Open%20Source-Yes-green?style=plastic
    )
    ](
        https://github.com/dannyvanlierop/NodeJS_HueBridge-Mirror-API
    )
[
    ![License: Mit](
        https://img.shields.io/badge/license-MIT-green.svg?style=plastic)
    ](
        https://en.wikipedia.org/wiki/MIT_License
    )
[
    ![Contributors](
        https://img.shields.io/github/contributors/dannyvanlierop/NodeJS_HueBridge-Mirror-API?style=plastic)
    ](
        https://github.com/dannyvanlierop/NodeJS_HueBridge-Mirror-API/graphs/contributors
    )
[
    ![Forks](
        https://img.shields.io/github/forks/dannyvanlierop/NodeJS_HueBridge-Mirror-API?style=plastic)
    ](
        https://github.com/dannyvanlierop/NodeJS_HueBridge-Mirror-API/network/members
	)
[
    ![Stars](
        https://img.shields.io/github/stars/dannyvanlierop/NodeJS_HueBridge-Mirror-API?style=plastic)
  ](
        https://github.com/dannyvanlierop/NodeJS_HueBridge-Mirror-API/stargazers
	)
[
    ![Issues](
        https://img.shields.io/github/issues/dannyvanlierop/NodeJS_HueBridge-Mirror-API?style=plastic)
  ](
        https://github.com/dannyvanlierop/NodeJS_HueBridge-Mirror-API/issues
	)
&nbsp;<br><br>
## Configure:
<hr>

Create a file named `.config.js` (in the the src directory). Add contents like below and adjust it to your needs.
```
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
```
&nbsp;<br>
## Run:
<hr>

Run this file from your favorite shell
```
node App.js
```

&nbsp;<br>
## Usage:
<hr>

Fetch light values from your new source like you would from the hue bridge.

```
One light example:  http://127.0.0.1/api/BRIDGE_USERNAME/lights/1/
```

```
All lights example:  http://127.0.0.1/api/BRIDGE_USERNAME/lights/
```

```
One sensor example:  http://127.0.0.1/api/BRIDGE_USERNAME/sensors/1/
```

```
All sensors example:  http://127.0.0.1/api/BRIDGE_USERNAME/sensors/
```

&nbsp;<br>
## Dependency:
<hr>

- [nodejs](https://nodejs.org/en/)<br>
```
apt install nodejs
```

- [node-hue-api](https://github.com/peter-murray/node-hue-api)<br>
```
npm install node-hue-api
```

- [fastify](https://github.com/fastify/fastify)<br>
```
npm install fastify
```

&nbsp;<br>
## License:
<hr>

For more details,
see the [LICENSES](https://github.com/dannyvanlierop/NodeJS_HueBridge-Mirror-API/blob/master/LICENSE) file.

<br>&nbsp;
