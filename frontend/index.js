const { io } = require("socket.io-client");

const socket = io("http://localhost:3001"); // Connect to your server

socket.on("connect", () => {
    console.log("Connected to server:", socket.id);
});

socket.on("message", (data) => {
    console.log("Received message:", data);
});

socket.on("user_created", (data) => {
    console.log("Received message - User Created :", data);
});

socket.on("user_loggedin", (data) => {
    console.log("Received message - User Logged In :", data);
});
