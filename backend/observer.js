const server = require('http').createServer();
const io = require('socket.io')(server);

io.on('connection', socket => {
    socket.emit('request', /* … */); // emit an event to the socket
    io.emit('response_test', /* … */); // emit an event to all connected sockets
    socket.on('urlFromFront', (data) => {

        console.log('test reçu avec succès')
        console.log(data)
    }); // listen to the event
});
server.listen(4000);

