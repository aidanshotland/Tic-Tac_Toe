const Gameboard = (function() {

    const board = ["","","","","","","","",""]

    function getBoard() {
        return board;
    }

    function placeMark(index, mark) {
        if (board[index]=== ""){
            board[index]=mark;
            return true;
        }
        return false;
    }

    function resetBoard() {
        for (let i =0; i<board.length; i++) {
            board[i]="";
        }
    }

    return {
        getBoard,
        placeMark,
        resetBoard
    }
})();

function createPlayer(name, mark){
    return {
         name,
         mark
    };
}

const GameController = (function() {
    const player1 = createPlayer('PLayer 1', 'X');
    const player2 = createPlayer('Player 2', '0');

    let currentPlayer = player1;
    let isGameOver=false;

    function playTurn(index) {
        if (isGameOver) return;
        if(Gameboard.placeMark(index, currentPlayer.mark)){
            if (checkWinner()) {
                console.log(`${currentPlayer.name} wins!`);
                isGameOver = true;
            } else if (Gameboard.getBoard().every(cell => cell !=="")){
                console.log("It's a tie!");
                isGameOver=true;
            } else {
                switchPlayer()
            }
        }
    }

    function switchPlayer(){
        currentPlayer = (currentPlayer === player1) ? player2: player1;
    }

    function checkWinner(){
        const board = Gameboard.getBoard();
        const winningCombos = [
            [0,1,2], [3,4,5], [6,7,8], // Rows
            [0,3,6], [1,4,7], [2,5,8], // Columns
            [0,4,8], [2,4,6]           // Diagonals
        ];

        return winningCombos.some(combo => {
            return combo.every(index => board[index] === currentPlayer.mark)
        });

    }

    function resetGame() {
        Gameboard.resetBoard();
        currentPlayer = player1;
        isGameOver = false;
    }

    return {
        playTurn,
        resetGame
    }
})()


const DisplayController = (function() {

    const gameboardDiv = document.getElementById("gameboard");

    function render() {
        const board = Gameboard.getBoard();
        gameboardDiv.innerHTML="";

        board.forEach((cell, index) => {
            const square = document.createElement("div");
            square.classList.add("square");
            square.textContent=cell;
            square.addEventListener("click", () => handleClick(index));
            gameboardDiv.appendChild(square);
        })
    }

    function handleClick(index) {
        GameController.playTurn(index);
        render();
    }
    return { render };
})();