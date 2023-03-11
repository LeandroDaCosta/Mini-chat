const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });

let messages = [];
let users = [];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/view/home.html');
});

server.listen(5501, () => {
    console.log("Servidor rodando na porta 5501");
});

io.on("connection", (socket) => {
    console.log("Usuário conectado com o ID: " + socket.id);

    if (users.length < 2) {
        users.push(socket.id);
    } else {
        socket.disconnect();
        console.log("Usuário com o ID " + socket.id + " foi desconectado. Limite de 2 usuários alcançado.");
        return;
    }

    // Envia todas as mensagens para o usuário recém-conectado
    socket.emit('allMessages', messages);

    socket.on('disconnect', () => {
        console.log('Usuário desconectado com o ID: ' + socket.id);
        const userIndex = users.indexOf(socket.id);
        if (userIndex > -1) {
            users.splice(userIndex, 1);
        }
    });

    socket.on("message", (data) => {
        messages.push({ user: socket.id, message: data });
        console.log(`Mensagem enviada por ${socket.id}: ${data}`);
        io.emit("allMessages", messages);
    });
});
