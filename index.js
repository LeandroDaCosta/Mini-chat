const { Console } = require('console');
const express = require('express');
const { Socket } = require('socket.io');
const app = express();
const server = require('http').createServer(app)
const io = require('socket.io')(server, { cors: { origin: '*' } })

const messages = [];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/view/home.html');
})

server.listen(5501, () => {
    console.log("server a rodar")
})

io.on("connection", (socket) => {
    console.log("usuario com o id " + socket.id)

    socket.emit("allMessages", messages);



    socket.on('disconnect', () => {
        console.log('usario desconectado!');
        console.log("usuario desconectado foi o "+socket.id)
      });


    socket.on("message", (data) => {
        messages.push(data);
        console.log("mensagem enviada por "+socket.id)
        io.emit("allMessages ", messages);
    });
});