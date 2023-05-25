// Generate a random five-letter word
function generateRandomWord() {
    const words = ['котик', 'блоха', 'килим', 'цукор', 'ґанок'];
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
}

// Get DOM elements
const feedback = document.getElementById('feedback');
const submitBtn = document.getElementById('enter');
const restartBtn = document.getElementById('restart');
const letterButtons = document.querySelectorAll('.letter');
const attemptsTable = document.getElementById('attemptsTable');
const deleteBtn = document.getElementById('delete');


// Initialize game variables
let targetWord;
let attempts = 0;
let columnIndex = 0;
const maxAttempts = 6;
const attemptsFeedback = [];

// Handle the guess submission
function handleGuess() {
    if(columnIndex != 5) {
        return;
    }
    let currentRow = document.getElementById('attemptsTable').rows.item(attempts).cells;;
    let guess = '';
    for (var j = 0; j < currentRow.length; j++) {
        guess += currentRow.item(j).innerHTML;
    }
    const [correctPositionCount, correctLetterCount] = checkGuess(guess, targetWord);

    attempts++;
    columnIndex = 0;
    if (correctPositionCount === 5) {
        feedback.textContent = `Congratulations! You guessed the word in ${attempts} attempts.`;
    } else {
        feedback.textContent = `Guess ${attempts}: ${guess} | Correct positions: ${correctPositionCount} | Correct letters: ${correctLetterCount}`;
    }

    if (attempts === maxAttempts) {
        feedback.textContent += `\nYou ran out of attempts. The word was ${targetWord}.`;
    }

    if (attempts === maxAttempts || correctPositionCount === 5) {
        submitBtn.disabled = true;
    }

    // Store the feedback for the current attempt
    attemptsFeedback.push(`${correctPositionCount}/${correctLetterCount}`);

    // Update the attempts table
    updateAttemptsTable(guess, attemptsFeedback);
}

function checkGuess() {

}

function handleLetterPress(event) {
    if(columnIndex == 5) {
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
    if(columnIndex == 0) {
        return;
    }
    columnIndex--;
    const currentRow = attempts;
    const cell = document.querySelector(`#cell-${currentRow}-${columnIndex}`);
    if (cell.textContent == '') {
        // No attempts made yet, nothing to delete
        return;
    }

    // Clear the current cell
    cell.textContent = '';
}

// Update the attempts table
function updateAttemptsTable(guess, attemptsFeedback) {
    const currentRow = Math.floor((attempts - 1) / 5);
    const row = document.querySelector(`tr:nth-child(${currentRow + 1})`);
    const guessCells = row.querySelectorAll('.guess-cell');
    const feedbackCells = row.querySelectorAll('.feedback-cell');

    // Update the table cells with the guess letters and feedback
    guess.split('').forEach((letter, index) => {
        guessCells[index].textContent = letter;
    });

    attemptsFeedback.forEach((feedback, index) => {
        feedbackCells[index].textContent = feedback;
    });
}

function handleRestart() {
    initializeGame();

    // Enable letter buttons
    letterButtons.forEach(button => {
        button.disabled = false;
    });

    // Set focus on the first cell of the initial row'
    columnIndex = 0;
    const firstCell = document.querySelector(`#cell-0-0`);
    firstCell.focus();
}

// Initialize a new game
function initializeGame() {
    targetWord = generateRandomWord();
    attempts = 0;
    feedback.textContent = '';

    // Clear the table cells
    const guessCells = document.querySelectorAll('.guess-cell');
    guessCells.forEach(cell => {
        cell.textContent = '';
    });

    const feedbackCells = document.querySelectorAll('.feedback-cell');
    feedbackCells.forEach(cell => {
        cell.textContent = '';
    });

    const emptyCells = document.querySelectorAll('.empty-cell');
    emptyCells.forEach(cell => {
        cell.textContent = '';
    });

    const firstCell = document.querySelector(`#cell-0-0`);
    firstCell.focus();

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