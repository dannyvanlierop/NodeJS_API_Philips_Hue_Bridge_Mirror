# NodeJS_HueBridge-Mirror-API
Mirror hue bridge values to an external source to offload bridge requests or make them available to other networks.<br>


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

Create a file named `config.json` (in the the parent directory from the script directory).
Add contents like below and adjust it to your needs.
```
{
	"bridgeUser" : "BRIDGE_USERNAME",
	"bridgeIP" : "10.0.0.99",
	"bridgeFetchInterval" : 80,
	"bridgeFetchIntervalMin" : 5,
	"bridgeFetchIntervalMax" : 3000,
	"bridgeFetchIntervalIncreaseInfo" : "slow down fetching by, ms = (fetch cycles no updates found * bridgeFetchIntervalIncrease)",
	"bridgeFetchIntervalIncrease" : 2,
	"bridgeFetchIntervalDecreaseInfo" : "speed up fetching by, ms = (updates found in last fetch * bridgeFetchIntervalDecrease)",
	"bridgeFetchIntervalDecrease" : 10,
	"fastifyIPListenInfo" : "127.0.0.1(only listen on local interface),192.168.1.1(only listen on one interface),0.0.0.0(listen on all interfaces)",
	"fastifyIPListen" : "0.0.0.0",
	"fastifyLogger" : "true",
	"fastifyPort" : "80"
}
```
&nbsp;<br>
## Run:
<hr>

Run this file from your favorite shell
```
node NodeJS_HueBridge-Mirror-API.js
```

&nbsp;<br>
## Usage:
<hr>

Fetch light values from your new source like you would from the hue bridge.

```
One light example:  http://HOST_IP/api/BRIDGE_USERNAME/lights/1/
```

```
All lights example:  http://HOST_IP/api/BRIDGE_USERNAME/lights/
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
