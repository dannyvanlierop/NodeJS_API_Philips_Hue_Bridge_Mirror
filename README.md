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

Create a file named `.config.json` (in the the src directory). Add contents like below and adjust it to your needs.
```
{
    "BridgeUser": "BRIDGE-USER-KEY-HERE"
}
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

Fetch light values with any client from your new source like you would from the hue bridge.

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


- [fastify](https://github.com/fastify/fastify)<br>
```
npm install fastify
```

- [follow-redirects](https://www.npmjs.com/package/follow-redirects)<br>
```
npm install follow-redirects
```

&nbsp;<br>
## License:
<hr>

For more details,
see the [LICENSES](https://github.com/dannyvanlierop/NodeJS_HueBridge-Mirror-API/blob/master/LICENSE) file.

<br>&nbsp;
