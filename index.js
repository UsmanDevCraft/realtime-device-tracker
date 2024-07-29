const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000; // Use dynamic port for deployment environments

const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: '*', // Update this to specific origins in production
        methods: ['GET', 'POST']
    }
});

app.use(cors({
    origin: 'https://realtime-device-tracker-system.vercel.app', // Replace with your client's URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
    console.log("connected");

    socket.on("send-location", (data) => {
        if (data.latitude && data.longitude) {
            io.emit("recieve-location", { id: socket.id, ...data });
        } else {
            console.error("Invalid data received", data);
        }
    });

    socket.on("disconnect", () => {
        io.emit("user-disconnected", socket.id);
    });
});

app.get("/", (req, res) => {
    res.render("index");
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
