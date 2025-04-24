"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cookieParser = require('cookie-parser');
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
const io = new socket_io_1.Server(httpServer);
io.on('connection', (socket) => {
    console.log("A User Connected");
    socket.on('message', (data) => {
        io.emit('message', data);
    });
});
httpServer.listen(3001, () => console.log('Server with websocket is runnig'));
app.use(express_1.default.json());
app.use(cookieParser());
app.use("/api", routes_1.default);
app.listen(3000, () => {
    console.log("server listening");
});
