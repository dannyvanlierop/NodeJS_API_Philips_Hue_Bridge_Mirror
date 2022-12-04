/**
 * @author Danny van Lierop
 * @description Mirror hue bridge values to external source to offload bridge requests or make them available to other networks
 * @license MIT
 * @dependencies node-hue-api, fastify
 */

'use strict';                       /** Using a variable, without declaring it, is not allowed **/
require('./.config.js')();          /** Load and run configuration file **/
require('./Terminal_Colors.js')();  /** Add function Color(color, text) to print colored text in terminal **/
require('./HueAPI.js')();           /** Load and run node-hue-api-v3 library **/
require('./Fastify.js')();          /** Load and run fastify http server **/
