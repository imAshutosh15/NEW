import express from 'express';
import router from './routes';
import { generateJsonWebToken, verifyToken } from "./jwt";
import http from 'http';
import { Server } from "socket.io";

const cookieParser = require('cookie-parser');
const app = express();

const httpServer = http.createServer(app)
const io = new Server(httpServer);

io.on('connection', (socket)=> {
    console.log("A User Connected");
    socket.on('message', (data)=>{
        io.emit('message',data);
    })
});

httpServer.listen(3001,()=> console.log('Server with websocket is runnig'));

app.use(express.json());
app.use(cookieParser());
app.use("/api", router)

app.listen(3000, ()=> {
    console.log("server listening");
});