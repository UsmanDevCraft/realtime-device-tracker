const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");

const app = express();
const port = 5000;

const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket)=>{
    socket.on("send-location", (data)=>{
        io.emit("recieve-location", {id: socket.id, ...data});
    });

    socket.on("disconnect", () => {
        io.emit("user-disconnected", socket.id);
    });

    console.log("connected");
});

app.get("/", (req, res) => {
    res.render("index");
});


server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
