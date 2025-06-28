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
    const player1 = createPlayer('Player 1', 'X');
    const player2 = createPlayer('Player 2', '0');

    let currentPlayer = player1;
    let isGameOver=false;
    let winner = null;

    function setPlayerNames(name1,name2){
        player1.name = name1 || "Player 1";
        player2.name = name2 || "Player 2";
        currentPlayer = player1
    }

    function playTurn(index) {
        if (isGameOver) return;
        if(Gameboard.placeMark(index, currentPlayer.mark)){
            if (checkWinner()) {
                winner = currentPlayer;
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

    function getWinner(){
        return winner;
    }

    function resetGame() {
        Gameboard.resetBoard();
        currentPlayer = player1;
        isGameOver = false;
    }

    function getCurrentPlayer() {
        return currentPlayer;
    }

    function getIsGameOver() {
        return isGameOver;
    }

    return {
        playTurn,
        resetGame,
        getIsGameOver,
        setPlayerNames,
        getWinner,
        getCurrentPlayer,
    }
})();


const DisplayController = (function() {

    const gameboardDiv = document.getElementById("gameboard");
    const messageDiv = document.getElementById("message");
    const restartBtn = document.getElementById("restart");
    const startBtn = document.getElementById("startGame");

    const player1Input = document.getElementById("player1Name");
    const player2Input = document.getElementById("player2Name");

    startBtn.addEventListener("click", () => {
        const name1 = player1Input.value;
        const name2 = player2Input.value;
        GameController.setPlayerNames(name1,name2);
        GameController.resetGame();
        render();
    })

    restartBtn.addEventListener("click", () => {
        GameController.resetGame();
        render();
    })

    function render() {
        const board = Gameboard.getBoard();
        gameboardDiv.innerHTML="";

        board.forEach((cell, index) => {
            const square = document.createElement("div");
            square.classList.add("square");
            square.textContent=cell;
            if (!GameController.getIsGameOver() && cell === ""){
                square.addEventListener("click", () => handleClick(index))
            }

            gameboardDiv.appendChild(square)
        })

        updateMessage();
    }

    function handleClick(index) {
        GameController.playTurn(index);
        render();
    }

    function updateMessage() {
        if (GameController.getIsGameOver()){
            const winner = GameController.getWinner();
            if (winner){
                messageDiv.textContent = `${winner.name} wins!`;
            } else {
                messageDiv.textContent = "It's a tie!";
            }
        } else {
            messageDiv.textContent= `It's ${GameController.getCurrentPlayer().name}'s turn.`
        }
    }

    return { render };
})();

DisplayController.render();