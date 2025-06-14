const express = require("express");
const socket = require("socket.io");
const http = require("http");
const {Chess} = require("chess.js");
const path = require("path");

const app = express();

const server = http.createServer(app);
const io = socket(server);

const chess = new Chess();
let players = {};
let currentPlayer = "w";

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("index", { title: "Welcome To Chess Game" });
});

io.on("connection", function (uniquesocket) {
    console.log("connected");

    if(!players.white) {
        players.white = uniquesocket.id;
        uniquesocket.emit("playerRole", "w");
    }else if(!players.black) {
        players.black = uniquesocket.id;
        uniquesocket.emit("playerRole", "b");
    }else{
        uniquesocket.emit("spectatorRole");
    }
    uniquesocket.on("disconnect", function() {
        if(socket.id === players.white){
            delete players.white;
        } else if (uniquesocket.id === players.black) {
            delete players.black;
        }
    });
  
    uniquesocket.on("move", (move)=>{
        try{
            if (chess.turn === "w" && socket.id !== players.white) return;
            if (chess.turn === "b" && socket.id !== players.black) return;

            const result = chess.move(move);
            if(result){
                currentPlayer = chess.turn();
                io.emit("move", move);
                io.emit("boardState", chess.fen())
            }
            else{
                console.log("Invalid mobe : ", move);
                uniquesocket.emit("invalidMove", move);
            }
        } catch (err) {
            console.log(err);
            uniquesocket.emit("Invalid move : ", move);
        }
    });
});

server.listen(3000, function (){
    console.log("listening on port 3000");
});














 // uniquesocket.on("disconnect", function(){
    //     console.log("disconnected");
    // });
//     uniquesocket.on("my game", function(){
//     console.log("my game received");
//     io.emit("my game received by everyone");
//  });