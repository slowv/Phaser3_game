const express = require('express');
const http = require('http').Server(express);
const io = require('socket.io').listen(http);
const port = process.env.PORT || 3000;

const connectionPlayers = new Map();
const rooms = [];
const maxPlayerInRoom = 6;

io.on('connection', socket => {
    console.log(socket.id + ' connect');
    connectionPlayers[socket] = socket;
    socket.on('disconnect', () => {
        console.log(socket.id + ' disconnect');
        delete connectionPlayers[socket];
        io.emit('disconnect', socket.id);
    })
});

function removePlayer(array, socket){
    for (let i = 0; i < array.length; i++) {
        if (array[i] === socket) {
            array.splice(i, 1);
        }
    }
}

http.listen(port, () => {
    console.log('Listening at :3000...')
});



