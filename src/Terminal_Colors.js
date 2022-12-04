module.exports = function()
{ 
    this.colors = {   /** Colors for debug purpose **/
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

    this.Color = function(color, text) { /** {String} color, {String} text, returns marked up text **/
        return (colors[color] + text + colors.Reset);
    };
};
//Include like: require('./Terminal_Colors.js')();