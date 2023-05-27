// Generate a random five-letter word
function generateRandomWord() {
    const words = ['котик', 'блоха', 'килим', 'цукор', 'ґанок'];
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
}

// Get DOM elements
const submitBtn = document.getElementById('enter');
const restartBtn = document.getElementById('restart');
const letterButtons = document.querySelectorAll('.letter');
const attemptsTable = document.getElementById('attemptsTable');
const deleteBtn = document.getElementById('delete');

let targetWord;
let attempts = 0;
let columnIndex = 0;
const maxAttempts = 6;

function handleGuess() {
    if (columnIndex !== 5) {
        return;
    }
    let currentRow = document.getElementById('attemptsTable').rows.item(attempts).cells;
    let guess = '';
    for (var j = 0; j < currentRow.length; j++) {
        guess += currentRow.item(j).innerHTML;
    }
    let isGuessCorrect = checkGuess(guess.toUpperCase(), targetWord.toUpperCase());
    if (isGuessCorrect) {

    } else {
        attempts++;
        columnIndex = 0;
    }
}

function checkGuess(guess, targetWord) {
    let count = 0;
    for (let i = 0; i < targetWord.length; i++) {
        const targetChar = targetWord[i];
        const guessChar = guess[i];
        const button = document.getElementById(guessChar);

        if (guessChar === targetChar) {
            const cell = document.querySelector(`#cell-${attempts}-${i}`);
            cell.style.backgroundColor = 'rgb(99,178,46)';
            button.style.backgroundColor = 'rgb(99,178,46)';
            ++count;
        } else if (targetWord.includes(guessChar)) {
            const cell = document.querySelector(`#cell-${attempts}-${i}`);
            cell.style.backgroundColor = 'rgb(234,202,73)';
            button.style.backgroundColor = 'rgb(234,202,73)';
        } else {
            button.style.backgroundColor = 'rgb(36, 36, 36)';
        }
    }

    return count === 5;
}

function handleLetterPress(event) {
    if (columnIndex == 5) {
        return;
    }
    const letter = event.target.textContent;
    const currentRow = attempts;

    const cell = document.querySelector(`#cell-${currentRow}-${columnIndex}`);

    cell.textContent = letter;

    // Move to the next column
    columnIndex++;

}

function handleDelete() {
    if (columnIndex === 0) {
        return;
    }
    columnIndex--;
    const cell = document.querySelector(`#cell-${attempts}-${columnIndex}`);
    if (cell.textContent === '') {
        // No attempts made yet, nothing to delete
        return;
    }
    // Clear the current cell
    cell.textContent = '';
}

function handleRestart() {
    initializeGame();
}

function initializeGame() {
    targetWord = generateRandomWord();
    attempts = 0;
    columnIndex = 0;

    // Clear the table cells
    const guessCells = document.querySelectorAll('.guess-cell');
    guessCells.forEach(cell => {
        cell.textContent = '';
    });

    const emptyCells = document.querySelectorAll('.empty-cell');
    emptyCells.forEach(cell => {
        cell.textContent = '';
        cell.style.backgroundColor = 'rgb(36, 36, 36)';
    });

    const firstCell = document.querySelector(`#cell-0-0`);
    firstCell.focus();

    const letterButtons = document.querySelectorAll('.letter');
    letterButtons.forEach(button => {
        button.disabled = false;
        button.style.backgroundColor = 'gray';
    });

    submitBtn.disabled = false;
    deleteBtn.disabled = false;
}

const rulesButton = document.getElementById("rules-button");
const popUp = document.createElement("div");
popUp.className = "popup";
popUp.innerHTML = `
  <div class="popup-content">
    <h2>Game Rules</h2>
    <ul>
    <li>Guess the Wordle in 6 tries.</li>
    <li>Each guess must be a valid 5-letter word.</li>
    <li>The color of the tiles will change to show how close your guess was to the word.</li>
    <li>Guess the Wordle in 6 tries.</li>
    <li>Guess the Wordle in 6 tries.</li>
    <li>Guess the Wordle in 6 tries.</li>
  </ul>
    <button id="close-popup">&#10005;</button>
  </div>
`;

rulesButton.addEventListener("click", () => {
    document.body.appendChild(popUp);
});

document.addEventListener("click", (event) => {
    if (event.target.id === "close-popup") {
        document.body.removeChild(popUp);
    }
});

// Event listeners
submitBtn.addEventListener('click', handleGuess);
deleteBtn.addEventListener('click', handleDelete);
restartBtn.addEventListener('click', handleRestart);
letterButtons.forEach(button => {
    button.addEventListener('click', handleLetterPress);
});

// Initialize the game on page load
initializeGame();