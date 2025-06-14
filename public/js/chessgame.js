// //const { render } = require("ejs");

const socket = io();
const chess = new Chess();

const boardElement = document.querySelector(".chessboard");

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

const renderBoard = () => {
    const board = chess.board();
    boardElement.innerHTML="";
    board.forEach((row, rowindex) => {
        row.forEach((square, squareindex) => {
            const squareElement = document.createElement("div");
            squareElement.classList.add(
                "square",
                (rowindex + squareindex) % 2 === 0 ? "light" : "dark"
            );

            squareElement.dataset.row = rowindex;
            squareElement.dataset.col = squareindex; 

            if (square) {
                const pieceElement = document.createElement("div");
                pieceElement.classList.add(
                    "piece",
                    square.color === "w" ? "white" : "black"
                ); 
                pieceElement.innerText = getPieceUnicode(square);
                pieceElement.draggable = playerRole === square.color;

                pieceElement.addEventListener("dragstart", (e) => {
                    if (pieceElement.draggable) {
                        draggedPiece = pieceElement;
                        sourceSquare = { row: rowindex, col: squareindex };
                        e.dataTransfer.setData("text/plain", "");
                    }
                });

                pieceElement.addEventListener("dragend", () => {
                    draggedPiece = null;
                    sourceSquare = null;
                });

                squareElement.appendChild(pieceElement);
            }

            squareElement.addEventListener("dragover", function (e) {
                e.preventDefault();
            });

            squareElement.addEventListener("drop", function (e) {
              e.preventDefault();
              if(draggedPiece) {
                const targetSource = {
                    row: parseInt(squareElement.dataset.row),
                    col: parseInt(squareElement.dataset.col),
                };

                handleMove(sourceSquare, targetSource);
              }
            });
            boardElement.appendChild(squareElement);
        });
    });

    if(playerRole === 'b'){
        boardElement.classList.add("flipped");
    }else{
        boardElement.classList.remove("flipped");
    }
};

const handleMove = (source, target) => {
    const move = {
        from: `${String.fromCharCode(97+ source.col)}${8 - source.row}`,
        to: `${String.fromCharCode(97+ target.col)}${8 - target.row}`,
        promotion: "q",
    };

    socket.emit("move", move);
};
const getPieceUnicode = (piece) => {
    const pieceUnicode = {
        w: {
            k: "\u2654", // ♔
            q: "\u2655", // ♕
            r: "\u2656", // ♖
            b: "\u2657", // ♗
            n: "\u2658", // ♘
            p: "\u2659", // ♙
        },
        b: {
            k: "\u265A", // ♚
            q: "\u265B", // ♛
            r: "\u265C", // ♜
            b: "\u265D", // ♝
            n: "\u265E", // ♞
            p: "\u265F", // ♟
        }
    };

    return pieceUnicode[piece.color]?.[piece.type] || "";
};

socket.on("playerRole", function(role) {
    playerRole = role;
    renderBoard();
});

socket.on("spectatorRole", function () {
    playerRole = null;
    renderBoard();
});

socket.on("boardState", function (fen) {
    chess.load(fen);
    renderBoard();
});

socket.on("move", function (move) {
    chess.load(move);
    renderBoard();
});

renderBoard();


// const socket = io();
// const chess = new Chess();

// const boardElement = document.querySelector(".chessboard");

// let draggedPiece = null;
// let sourceSquare = null;
// let playerRole = null;

// const renderBoard = () => {
//     const board = chess.board();
//     boardElement.innerHTML = "";

//     board.forEach((row, rowindex) => {
//         row.forEach((square, squareindex) => {
//             const squareElement = document.createElement("div");
//             squareElement.classList.add(
//                 "square",
//                 (rowindex + squareindex) % 2 === 0 ? "light" : "dark"
//             );

//             squareElement.dataset.row = rowindex;
//             squareElement.dataset.col = squareindex;

//             if (square) {
//                 const pieceElement = document.createElement("div");
//                 pieceElement.classList.add(
//                     "piece",
//                     square.color === "w" ? "white" : "black"
//                 );
//                 pieceElement.innerText = getPieceUnicode(square);
//                 pieceElement.draggable = playerRole === square.color;

//                 pieceElement.addEventListener("dragstart", (e) => {
//                     if (pieceElement.draggable) {
//                         draggedPiece = pieceElement;
//                         sourceSquare = { row: rowindex, col: squareindex };
//                         e.dataTransfer.setData("text/plain", "");
//                     }
//                 });

//                 pieceElement.addEventListener("dragend", () => {
//                     draggedPiece = null;
//                     sourceSquare = null;
//                 });

//                 squareElement.appendChild(pieceElement);
//             }

//             squareElement.addEventListener("dragover", function (e) {
//                 e.preventDefault();
//             });

//             squareElement.addEventListener("drop", function (e) {
//                 e.preventDefault();
//                 if (draggedPiece) {
//                     const targetSquare = {
//                         row: parseInt(squareElement.dataset.row),
//                         col: parseInt(squareElement.dataset.col),
//                     };

//                     handleMove(sourceSquare, targetSquare);
//                 }
//             });

//             boardElement.appendChild(squareElement);
//         });
//     });

//     if (playerRole === "b") {
//         boardElement.classList.add("flipped");
//     } else {
//         boardElement.classList.remove("flipped");
//     }
// };

// const handleMove = (source, target) => {
//     const move = {
//         from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
//         to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
//         promotion: "q",
//     };

//     socket.emit("move", move); // ✅ Fixed typo from wmit to emit
// };

// const getPieceUnicode = (piece) => {
//     const pieceUnicode = {
//         w: {
//             k: "\u2654", // ♔
//             q: "\u2655", // ♕
//             r: "\u2656", // ♖
//             b: "\u2657", // ♗
//             n: "\u2658", // ♘
//             p: "\u2659", // ♙
//         },
//         b: {
//             k: "\u265A", // ♚
//             q: "\u265B", // ♛
//             r: "\u265C", // ♜
//             b: "\u265D", // ♝
//             n: "\u265E", // ♞
//             p: "\u265F", // ♟
//         },
//     };

//     return pieceUnicode[piece.color]?.[piece.type] || "";
// };

// socket.on("playerRole", function (role) {
//     playerRole = role;
//     renderBoard();
// });

// socket.on("spectatorRole", function () {
//     playerRole = null;
//     renderBoard();
// });

// socket.on("boardState", function (fen) {
//     chess.load(fen);
//     renderBoard();
// });

// socket.on("move", function (fen) {
//     chess.load(fen);
//     renderBoard();
// })

// renderBoard();
