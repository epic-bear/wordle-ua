const submitBtn = document.getElementById('enter');
const restartBtn = document.getElementById('restart');
const letterButtons = document.querySelectorAll('.letter');
const attemptsTable = document.getElementById('attemptsTable');
const deleteBtn = document.getElementById('delete');
const feedback = document.getElementById('feedback');

const maxAttempts = 6;
let words;
let targetWord;
let attempts = 0;
let columnIndex = 0;

function initializeGame() {
    function generateRandomWord() {
        const request = new XMLHttpRequest();
        request.open('GET', 'words.txt', false);
        request.send();
        const wordsString = request.responseText.replace(/[\n\r]/g, ''); // Remove new lines
        words = wordsString.split(',');
        const randomIndex = Math.floor(Math.random() * words.length);
        return words[randomIndex];
    }

    targetWord = generateRandomWord();
    attempts = 0;
    columnIndex = 0;
    feedback.textContent = '';

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

function showMessage(message, duration, appendMessage) {
    const popUp = document.createElement("div");
    popUp.className = "popup-message";
    popUp.textContent = message;
    document.body.appendChild(popUp);
    popUp.style.position = "fixed";
    popUp.style.top = "35%";
    popUp.style.left = "50%";
    popUp.style.transform = "translate(-50%, -50%)";
    popUp.style.backgroundColor = 'black';
    popUp.style.color = 'white';
    popUp.style.fontSize = '30px';
    popUp.style.padding = "40px";

    if (appendMessage) {
        const note = document.createElement("div");
        note.className = "popup-note";
        note.textContent = appendMessage;
        popUp.appendChild(note);
    }
    setTimeout(() => {
        document.body.removeChild(popUp);
    }, duration);
}

function handleGuess() {
    if (attempts === maxAttempts) {
        showMessage(
            "Досягнуто максимальної кількості спроб.",
            2000,
            "Щоб перезапустити гру, натисніть кнопку «Нова гра»."
        );
        deleteBtn.disabled = true;
        return true;
    }
    if (columnIndex !== 5) {
        return;
    }
    let currentRow = document.getElementById('attemptsTable').rows.item(attempts).cells;
    let guess = '';
    for (let j = 0; j < currentRow.length; j++) {
        guess += currentRow.item(j).innerHTML;
    }
    if (!words.includes(guess)) {
        // Guess is not in the words list
        showMessage("Цього слова немає в списку.", 1000);
        return false;
    }
    let isGuessCorrect = checkGuess(guess, targetWord);
    if (isGuessCorrect) {
        showMessage("Вітаю! Ви вгадали слово.",
            2000,
            "Щоб перезапустити гру, натисніть кнопку «Нова гра».");
        deleteBtn.disabled = true;
        return true;
    } else {
        attempts++;
        columnIndex = 0;
    }
    if (attempts === maxAttempts) {
        showMessage(
            "Досягнуто максимальної кількості спроб.",
            2000,
            "Щоб перезапустити гру, натисніть кнопку «Нова гра»."
        );
        deleteBtn.disabled = true;
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
    const cell = document.querySelector(`#cell-${attempts}-${columnIndex}`);
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