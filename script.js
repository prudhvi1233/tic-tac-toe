// Game state variables
let currentPlayer = "X";
let gameMode = "ai"; // 'ai' or 'multiplayer'
let playerNames = { X: "Player", O: "AI" };

// DOM Elements
const board = document.getElementById("board");
const statusText = document.getElementById("status");
const welcomeScreen = document.getElementById("welcome-screen");
const formScreen = document.getElementById("form-screen");
const gameScreen = document.getElementById("game-screen");
const aiModeBtn = document.getElementById("ai-mode-btn");
const multiplayerBtn = document.getElementById("multiplayer-btn");
const playerForm = document.getElementById("player-form");
const player1NameInput = document.getElementById("player1-name");
const player2NameInput = document.getElementById("player2-name");
const player2Input = document.getElementById("player2-input");
const formTitle = document.getElementById("form-title");
const restartBtn = document.getElementById("restart-btn");
const homeBtn = document.getElementById("home-btn");
const backBtn = document.getElementById("back-btn");

// Game variables
let cells = [];
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
const ai = "O";

const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
];

// Initialize the board
initializeBoard();

// Set up event listeners
setupEventListeners();

function initializeBoard() {
    // Clear the board
    board.innerHTML = '';
    cells = [];
    
    // Create board cells
    for (let i = 0; i < 9; i++) {
        let cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = i;
        cell.addEventListener("click", handleCellClick);
        board.appendChild(cell);
        cells.push(cell);
    }
}

function setupEventListeners() {
    // Mode selection buttons
    aiModeBtn.addEventListener("click", () => {
        gameMode = "ai";
        formTitle.textContent = "Enter Your Name";
        player2Input.style.display = "none";
        showScreen(formScreen);
    });
    
    multiplayerBtn.addEventListener("click", () => {
        gameMode = "multiplayer";
        formTitle.textContent = "Enter Player Names";
        player2Input.style.display = "block";
        showScreen(formScreen);
    });
    
    // Form submission
    playerForm.addEventListener("submit", handleFormSubmit);
    
    // Navigation buttons
    backBtn.addEventListener("click", () => showScreen(welcomeScreen));
    restartBtn.addEventListener("click", resetGame);
    homeBtn.addEventListener("click", () => {
        resetGame();
        showScreen(welcomeScreen);
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const player1Name = player1NameInput.value.trim() || "Player 1";
    
    if (gameMode === "ai") {
        playerNames.X = player1Name;
        playerNames.O = "AI";
    } else {
        const player2Name = player2NameInput.value.trim() || "Player 2";
        playerNames.X = player1Name;
        playerNames.O = player2Name;
    }
    
    // Set current player to X for new game
    currentPlayer = "X";
    
    // Show game screen
    showScreen(gameScreen);
    
    // Reset the game
    resetGame();
}

function handleCellClick(e) {
    const index = parseInt(e.target.dataset.index);
    
    if (gameBoard[index] !== "" || !gameActive) return;
    
    makeMove(index, currentPlayer);
    
    if (!checkGameOver()) {
        // Switch player for multiplayer, or call AI for AI mode
        if (gameMode === "multiplayer") {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
        } else if (currentPlayer === "X") {
            // Only AI moves after player moves
            setTimeout(() => {
                if (gameActive) {
                    aiMove();
                }
            }, 500);
        }
    }
}

function aiMove() {
    // Simple AI: pick a random empty cell
    let emptyCells = gameBoard
        .map((val, idx) => val === "" ? idx : null)
        .filter(val => val !== null);

    if (emptyCells.length > 0) {
        let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        makeMove(randomIndex, ai);
        checkGameOver();
    }
}

function makeMove(index, player) {
    gameBoard[index] = player;
    // Add class for styling X and O - don't set text content since CSS handles it
    cells[index].classList.add(player.toLowerCase());
}

function checkGameOver() {
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (
            gameBoard[a] &&
            gameBoard[a] === gameBoard[b] &&
            gameBoard[a] === gameBoard[c]
        ) {
            // Determine winner name
            const winner = playerNames[gameBoard[a]];
            statusText.textContent = `${winner} won the game!`;
            statusText.classList.remove('status-draw');
            statusText.classList.add('status-winner');
            gameActive = false;
            
            // Highlight winning cells
            cells[a].classList.add('win-cell');
            cells[b].classList.add('win-cell');
            cells[c].classList.add('win-cell');
            
            // Trigger celebration effect
            triggerCelebration();
            
            return true;
        }
    }

    if (!gameBoard.includes("")) {
        statusText.textContent = "It's a Draw!";
        statusText.classList.remove('status-winner');
        statusText.classList.add('status-draw');
        gameActive = false;
        return true;
    }

    return false;
}

function resetGame() {
    // Reset game state
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    statusText.textContent = "";
    statusText.classList.remove('status-winner', 'status-draw');
    currentPlayer = "X";
    
    // Clear the board
    cells.forEach(cell => {
        cell.className = "cell"; // Reset to just the base class
    });
}

function showScreen(screenElement) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show the requested screen
    screenElement.classList.add('active');
}

function triggerCelebration() {
    // Create confetti elements
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8000'];
    const body = document.body;
    
    // Create 100 confetti pieces
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Random position
        confetti.style.left = Math.random() * 100 + 'vw';
        
        // Random size
        const size = Math.random() * 10 + 5;
        confetti.style.width = size + 'px';
        confetti.style.height = size + 'px';
        
        // Random color
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Random animation duration
        const duration = Math.random() * 3 + 2; // 2-5 seconds
        confetti.style.animationDuration = duration + 's';
        
        body.appendChild(confetti);
        
        // Remove confetti after animation completes
        setTimeout(() => {
            confetti.remove();
        }, duration * 1000);
    }
}
