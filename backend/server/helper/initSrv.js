const config = require('../../app/etc/config.json'),
    EventEmitter = require('events'),
    app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http);

var ee = new EventEmitter;

http.listen(config.NODE_BACKEND_PORT, function () {
    console.log('listening on *:' + config.NODE_BACKEND_PORT);
    ee.emit('app-started');
});

/**
 * Rewrite globale de la console
 * <3
 * @see https://www.npmjs.com/package/override-console-log
 */
console.log=(function() {
    var orig=console.log;
    return function() {
        try {
            var tmp=process.stdout;
            process.stdout=process.stderr;
            io.sockets.emit('server_log', {args: arguments});
            // orig.apply(console, ['hey']);
            orig.apply(console, arguments);
        } finally {
            process.stdout=tmp;
        }
    };
})();

console.info=(function() {
    var orig=console.info;
    return function() {
        try {
            var tmp=process.stdout;
            process.stdout=process.stderr;
            orig.apply(console, arguments);
        } finally {
            process.stdout=tmp;
        }
    };
})();

/**
 * Ici on spécifie ce qu'on renvoie, initialisé, à l'app
 * @type {}
 */
module.exports = {
    io: io
}
