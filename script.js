const formContainer = document.getElementById('start-form');
const inputButtons = document.querySelectorAll('.radio-container');
const questionContainer = document.querySelector('.item-container');
// Best Scores
const bestScores = document.querySelectorAll('.best-score-value');
// Pages
const menuPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
// Wrong/Right buttons
const buttons = document.querySelector('.item-footer');

// Countdown Value
const countdown = document.querySelector('.countdown');

// Score Page
const finalTime = document.querySelector('.final-time');
const baseTime = document.querySelector('.base-time');
const penaltyTime = document.querySelector('.penalty-time')
const playAgainBtn = document.querySelector('.play-again');

let amountOfQuestions;
let equations = [];
let singleEquation = {};
let singleWrongEquation = {};
let wrongEquation = [];
// Player Guesses
let playerGuesses = [];
// Scroll
let scrollY = 0;
// Time
let time = 0;
let penalty = 0;
let calculatingTime;
let bestScoresArray = [];

// Local Strogae Functionality
function calculateDataFromLocalStorage() {
    let timeAll = time + penalty;
    if (localStorage.getItem('bestTimes')) {
        bestScoresArray = JSON.parse(localStorage.bestTimes)
        for (let i = 0; i < bestScoresArray.length; i++) {
            if (bestScoresArray[i].bestTime === "0.0" && bestScoresArray[i].amount == amountOfQuestions) {
                bestScoresArray[i].bestTime = timeAll.toFixed(1);
                continue;
            }
            if (bestScoresArray[i].amount == amountOfQuestions) {
                if (time < Number(bestScoresArray[i].bestTime)) {
                    bestScoresArray[i].bestTime = `${timeAll.toFixed(1)}`;
                }
            }
        }
    } else {
        bestScoresArray = [
            {
                amount: 10, bestTime: "0.0",
            },
            {
                amount: 25, bestTime: "0.0",
            },
            {
                amount: 50, bestTime: "0.0",
            },
            {
                amount: 99, bestTime: "0.0",
            },
        ]
    }
    localStorage.setItem('bestTimes', JSON.stringify(bestScoresArray));
    bestScores.forEach((item, index) => {
        item.textContent = bestScoresArray[index].bestTime;
    })
}

// Play again functionality
function playAgain() {
    scorePage.hidden = true;
    menuPage.hidden = false;
    playAgainBtn.hidden = true;
    calculateDataFromLocalStorage();
    time = 0;
    penalty = 0;
}

function calculatePenalty() {
    for (let i = 0; i < playerGuesses.length; i++) {
        if (playerGuesses[i] !== equations[i].evaluation) {
            penalty += 1;
        }
    }
}

function addTime() {
    time += 0.1
}

// Calculate Time
function startTime() {
    calculatingTime = setInterval(() => {
        addTime();
    }, 100)
}

function showScorePage() { 
    // Remove equations, player guesses and scroll value
    playerGuesses = [];
    equations = [];
    scrollY = 0;
    questionContainer.scroll(0, 0);
    // Show score page
    scorePage.hidden = false;
    gamePage.hidden = true;
    buttons.classList.add('hidden');
    let time2 = time;
    baseTime.textContent = `Base Time : ${time.toFixed(1)}s`;
    penaltyTime.textContent = `Penalty Time : ${penalty}s`;
    const finalTimeValue = (Number(time2) + Number(penalty)).toFixed(1);
    finalTime.textContent = `Final Time : ${finalTimeValue}s`;
    playAgainBtn.hidden = false;
}

function select(playerGuess) {
    let value = playerGuess ? true : false;
    playerGuesses.push(value);
    // If we answered all questions go to scorePage
    if (playerGuesses.length == amountOfQuestions) {
        clearInterval(calculatingTime);
        calculatePenalty();
        showScorePage();
        return;
    }
    scrollY += 80;
    questionContainer.scroll(0, scrollY);
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
    // Reset DOM, Set Blank Space Above
    questionContainer.textContent = '';
    const topSpacer = document.createElement('div');
    topSpacer.classList.add('height-240');
    // Selected item
    const selectedDiv = document.createElement('div');
    selectedDiv.classList.add('selected-item');
    // Append
    questionContainer.append(topSpacer, selectedDiv);
    // Generate equations
    generateEquations();
    equationsToDOM();
    questionContainer.scrollTo(0, 0)
    // Bottom Spacer
    const bottomSpacer = document.createElement('div');
    bottomSpacer.classList.add('height-500');
    // Append
    questionContainer.append(bottomSpacer);
  }

function randomNumber(number) {
    return Math.floor(Math.random() * number);
}

// Generate our True/False equations
function generateEquations() {
    const trueQuestions = randomNumber(amountOfQuestions);
    const falseEquations = amountOfQuestions - trueQuestions;
    // True equations
    for (let i = 0; i < trueQuestions; i++) {
        const firstNumber = randomNumber(20);
        const secondNumber = randomNumber(20);
        const data = `${firstNumber} x ${secondNumber} = ${firstNumber * secondNumber}`;
        singleEquation = {value: data, evaluation: true};
        equations.push(singleEquation);
    }
    // False equations
    for (let i = 0; i < falseEquations; i++) {
        const firstNumber = randomNumber(20);
        const secondNumber = randomNumber(20);
        wrongEquation[0] = `${firstNumber + 1} x ${secondNumber} = ${firstNumber * secondNumber}`;
        wrongEquation[1] = `${firstNumber} x ${secondNumber - 2} = ${firstNumber * secondNumber}`;
        wrongEquation[2] = `${firstNumber} x ${secondNumber} = ${firstNumber * secondNumber + 2}`;
        // Generate random mistake
        const randomIndex = randomNumber(2);
        const data = wrongEquation[randomIndex];
        singleWrongEquation = {value: data, evaluation: false};
        equations.push(singleWrongEquation);
    }
    shuffle(equations);
}

// Take our random questions and generate html objects for it
function equationsToDOM() {
    equations.forEach((equation) => {
      // Item
      const item = document.createElement('div');
      item.classList.add('item');
      // Equation Text
      const equationText = document.createElement('h1');
      equationText.textContent = equation.value;
      // Append
      item.appendChild(equationText);
      questionContainer.appendChild(item);
    });
  }

// Show our game Page
function startGamePage() {
    startTime();
    gamePage.hidden = false;
    countdownPage.hidden = true;
    buttons.classList.remove('hidden');
    populateGamePage();
    // tutaj
}

// Code our countdown Page functionality
function startCount() {
    let value = 3;
    countdown.textContent = value;
     const time = setInterval(() => {
        value -= 1;
        countdown.textContent = value;
        if (value === 0) {
            countdown.textContent = 'START!';
            value = 3;
            clearInterval(time);
        }
     }, 1000)
}

// Show countdown page and start counting
function startCountdownPage(event) {
    event.preventDefault();
    if (amountOfQuestions !== undefined) {
        menuPage.hidden = true;
        countdownPage.hidden = false;

        // Start counting
        startCount();
        setTimeout(startGamePage, 4000);
    }
}

// Select appropriate button, and get amount of question
formContainer.addEventListener('click', () => {
    inputButtons.forEach((item) => {
        item.classList.remove('selected-label');
        if (item.children[1].checked) {
            item.classList.add('selected-label');
            amountOfQuestions = item.children[1].value;
        }
    })
})

formContainer.addEventListener('submit', startCountdownPage);

// On Load 
calculateDataFromLocalStorage();