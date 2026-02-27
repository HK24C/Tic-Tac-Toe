const statusDisplay = document.querySelector(".game-status");
const cells = document.querySelectorAll(".cell");
const restartButton = document.querySelector(".game-restart");

let gameActive = true;
let currentPlayer = "O"; // Human starts
let gameState = ["", "", "", "", "", "", "", "", ""];

const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;

statusDisplay.innerHTML = currentPlayerTurn();

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', handleRestartGame);

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(clickedCellEvent) {

    // Only allow human (O) to click
    if (currentPlayer !== "O" || !gameActive) return;

    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(
        clickedCell.getAttribute('data-cell-index')
    );

    if (gameState[clickedCellIndex] !== "") return;

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
}

function handleResultValidation() {

    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];

        if (a === '' || b === '' || c === '') continue;

        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        return;
    }

    let roundDraw = !gameState.includes("");

    if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        return;
    }

    handlePlayerChange();
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === "O" ? "X" : "O";
    statusDisplay.innerHTML = currentPlayerTurn();

    // If it's AI turn → make automatic move
    if (currentPlayer === "X" && gameActive) {
        setTimeout(makeAutomaticMove, 500);
    }
}

function makeAutomaticMove() {

    if (!gameActive) return;

    // 1️⃣ Try to WIN
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];

        if (gameState[a] === "X" && gameState[b] === "X" && gameState[c] === "") {
            playMove(c);
            return;
        }
        if (gameState[a] === "X" && gameState[c] === "X" && gameState[b] === "") {
            playMove(b);
            return;
        }
        if (gameState[b] === "X" && gameState[c] === "X" && gameState[a] === "") {
            playMove(a);
            return;
        }
    }

    // 2️⃣ Block O if about to WIN
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];

        if (gameState[a] === "O" && gameState[b] === "O" && gameState[c] === "") {
            playMove(c);
            return;
        }
        if (gameState[a] === "O" && gameState[c] === "O" && gameState[b] === "") {
            playMove(b);
            return;
        }
        if (gameState[b] === "O" && gameState[c] === "O" && gameState[a] === "") {
            playMove(a);
            return;
        }
    }

    // 3️⃣ Otherwise random move
    let emptyCells = [];

    for (let i = 0; i < gameState.length; i++) {
        if (gameState[i] === "") {
            emptyCells.push(i);
        }
    }

    if (emptyCells.length === 0) return;

    let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    playMove(randomIndex);
}

// Helper function
function playMove(index) {
    let cell = document.querySelector(`[data-cell-index='${index}']`);
    handleCellPlayed(cell, index);
    handleResultValidation();
}

    if (emptyCells.length === 0) return;

    // Random selection
    let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    let cell = document.querySelector(`[data-cell-index='${randomIndex}']`);

    handleCellPlayed(cell, randomIndex);
    handleResultValidation();
}

function handleRestartGame() {
    gameActive = true;
    currentPlayer = "O";
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = currentPlayerTurn();
    cells.forEach(cell => cell.innerHTML = "");
}

