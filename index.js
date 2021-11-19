// Default variables for player
let player = {
    pattern: [],
    patternlength: 3,
    input: [],
    squareIDs: [],
    progress: false,
    currentlevel: 1,
    numberofsquares: 9,
    livesremaining: 3,
    inputpause: true,
    maxlevelreached: 0
}

// DOM
const startGameButton = document.querySelector('#start-button');
const tryAgainButton = document.querySelector('#try-again-button');

const levelDisplay = document.querySelector('#level');
const livesDisplay = document.querySelector('#lives');
const gameDisplay = document.querySelector('#memory-game');
const gameOverDisplay = document.querySelector('#game-over');
const levelReachedDisplay = document.querySelector('#level-reached');
const heartTwo = document.querySelector('#heart-two');
const heartTwoPath = document.querySelector('#heart-two-path');
const heartThree = document.querySelector('#heart-three');
const heartThreePath = document.querySelector('#heart-three-path');

const container = document.querySelector('#squares');
const rowOne = document.querySelector('#row-1');
const rowTwo = document.querySelector('#row-2');
const rowThree = document.querySelector('#row-3');

// Start/restart game
const startGame = () => {
    isGameOver = false;
    resetGame();
    resetSquares();
    resetPattern();
    updateInfoDisplay();
    hideInstructions();
    resetGameDisplay();
    setTimeout(function() {
        randomPattern();
    }, 1000)
}

startGameButton.addEventListener('click', startGame);
tryAgainButton.addEventListener('click', startGame);

// Hide instructions
const hideInstructions = () => {
    const instructions = document.querySelector('#instructions');
    instructions.classList.add('hidden');
    setTimeout(function() {
        instructions.style.display = 'none';
    }, 500)
}



// Pattern generation
const randomPattern = () => {
    player.inputpause = true;
    // maps IDs of all 'square' elements to the squareIDs array
    // updates player.numberofsquares with player.squareIDs.length (for when there are more squares at later levels)
    if (isGameOver === false) {
        let squareElems = document.querySelectorAll('div[class~="square"]');
        player.squareIDs = [].map.call(squareElems, function (s) {
            return s.id;
        });
        player.numberofsquares = player.squareIDs.length;
        
        // updates player.pattern with random non-repeating values (IDs) from player.squareIDs
        // animates the squares with matching ids
        for (let i = 0; i < (player.patternlength); i++) {
            rand = Math.floor(Math.random() * (player.squareIDs.length));
            player.pattern.push(player.squareIDs[rand]);
            player.squareIDs.splice(rand, 1);
            squareElems[player.pattern[i]-1].classList.add('light-pattern');
            setTimeout(function () {
                squareElems[player.pattern[i]-1].classList.remove('light-pattern');
            }, 1000)
        }

        // input pause is disabled and playerInput executes
        if (player.pattern.length === player.patternlength) {
            setTimeout(function() {
                player.inputpause = false;
                playerInput();
            }, 1500);
        }
    }
}

// Player input
const playerInput = () => {
    let squareElems = document.querySelectorAll('div[class~="square"]');
    squareElems.forEach(function(elem) {
        elem.addEventListener('click', function () {
            if (player.inputpause === false && player.input.includes(this.id) === false) {
                player.input.push(this.id);
                if (player.pattern.includes(this.id)) {
                    this.classList.add('correct');
                } else if (!player.pattern.includes(this.id)) {
                    this.classList.add('incorrect');
                }
                matchCheck();
            }
        })
    })
}

// Compare player input to randomly generated pattern
const matchCheck = () => {
    let squareElems = document.querySelectorAll('div[class~="square"]');
    if (player.pattern.every(i => player.input.includes(i)) && player.input.length >= player.pattern.length) {
        player.inputpause = true;
        player.progress = true;
        squareElems.forEach(function(elem) {
            elem.classList.remove('incorrect');
            setTimeout(function() {
                elem.classList.remove('correct');
            }, 1000)
        })
        setTimeout(function() {
            progressCheck();
        }, 2000)
    }
    else if (!player.input.every(i => player.pattern.includes(i))) {
        let filtered = player.input.filter(i => !player.pattern.includes(i));
        if (filtered.length === 3) {
            player.inputpause = true;
            player.progress = false;
            squareElems.forEach(function(elem) {
                elem.classList.remove('correct');
                setTimeout(function() {
                    elem.classList.remove('incorrect');
                }, 1000)
            })
            setTimeout(function() {
                progressCheck();
            }, 2000)
        }
    }
}

// Level incrementation
const progressCheck = () => {
    if (player.progress === false) {
        player.livesremaining -= 1;
        if (player.livesremaining === 0) {
            isGameOver = true;
            gameOver();
        } else if (player.livesremaining >= 1) {
            isGameOver = false;
            updateInfoDisplay();
            resetPattern();
            setTimeout(function() {
                randomPattern();
            }, 500)
        }
    } else if (player.progress === true) {
        isGameOver = false;
        player.currentlevel += 1;
        player.patternlength += 1;
        addSquares();
        updateInfoDisplay();
        resetPattern();
        setTimeout(function() {
            randomPattern();
        }, 500)
    }
}

// Reset pattern and input
const resetPattern = () => {
    player.pattern = [];
    player.input = [];
    player.squareIDs = [];
}

// Notifications
const updateInfoDisplay = () => {
    levelDisplay.innerHTML = player.currentlevel;
    if (player.livesremaining === 2 && player.progress === false) {
        heartThree.className = 'bi bi-suit-heart';
        heartThreePath.setAttribute('d', 'm8 6.236-.894-1.789c-.222-.443-.607-1.08-1.152-1.595C5.418 2.345 4.776 2 4 2 2.324 2 1 3.326 1 4.92c0 1.211.554 2.066 1.868 3.37.337.334.721.695 1.146 1.093C5.122 10.423 6.5 11.717 8 13.447c1.5-1.73 2.878-3.024 3.986-4.064.425-.398.81-.76 1.146-1.093C14.446 6.986 15 6.131 15 4.92 15 3.326 13.676 2 12 2c-.777 0-1.418.345-1.954.852-.545.515-.93 1.152-1.152 1.595L8 6.236zm.392 8.292a.513.513 0 0 1-.784 0c-1.601-1.902-3.05-3.262-4.243-4.381C1.3 8.208 0 6.989 0 4.92 0 2.755 1.79 1 4 1c1.6 0 2.719 1.05 3.404 2.008.26.365.458.716.596.992a7.55 7.55 0 0 1 .596-.992C9.281 2.049 10.4 1 12 1c2.21 0 4 1.755 4 3.92 0 2.069-1.3 3.288-3.365 5.227-1.193 1.12-2.642 2.48-4.243 4.38z')
    }
    if (player.livesremaining === 1 && player.progress === false) {
        heartTwo.className = 'bi bi-suit-heart';
        heartTwoPath.setAttribute('d', 'm8 6.236-.894-1.789c-.222-.443-.607-1.08-1.152-1.595C5.418 2.345 4.776 2 4 2 2.324 2 1 3.326 1 4.92c0 1.211.554 2.066 1.868 3.37.337.334.721.695 1.146 1.093C5.122 10.423 6.5 11.717 8 13.447c1.5-1.73 2.878-3.024 3.986-4.064.425-.398.81-.76 1.146-1.093C14.446 6.986 15 6.131 15 4.92 15 3.326 13.676 2 12 2c-.777 0-1.418.345-1.954.852-.545.515-.93 1.152-1.152 1.595L8 6.236zm.392 8.292a.513.513 0 0 1-.784 0c-1.601-1.902-3.05-3.262-4.243-4.381C1.3 8.208 0 6.989 0 4.92 0 2.755 1.79 1 4 1c1.6 0 2.719 1.05 3.404 2.008.26.365.458.716.596.992a7.55 7.55 0 0 1 .596-.992C9.281 2.049 10.4 1 12 1c2.21 0 4 1.755 4 3.92 0 2.069-1.3 3.288-3.365 5.227-1.193 1.12-2.642 2.48-4.243 4.38z')
    }
}



// Add square
const addSquares = () => {
    // every 3rd level increases the number of squares
    if (player.currentlevel % 3 === 0) {
        // creates a new row
        let newRow = document.createElement('div');
        newRow.classList.add('row');
        container.appendChild(newRow);

        // this ensures the new row has the same number of square div elements as all the others
        let allRows = document.querySelectorAll('#squares > .row');
        for (let i = 0; i < allRows.length-1; i++) {
            let fillSquare = document.createElement('div');
            fillSquare.classList.add('square', 'col');
            allRows[allRows.length-1].appendChild(fillSquare);
        }

        // adds 1 square div element to all rows
        allRows.forEach(row => {
            let newSquare = document.createElement('div');
            newSquare.classList.add('square', 'col');
            row.appendChild(newSquare);
        })

        // resets ids of all square div elements in ascending order
        resetSquareIDs();

        resizeSquares();
    }
}

// Resize squares
const resizeSquares = () => {
    let squareElems = document.querySelectorAll('div[class~="square"]');
    if (player.currentlevel === 3) {
        for (let i = 0; i < squareElems.length; i++) {
            squareElems[i].classList.add('four');
        }
    }
    if (player.currentlevel === 6) {
        for (let i = 0; i < squareElems.length; i++) {
            squareElems[i].classList.remove('four');
            squareElems[i].classList.add('five');
        }
    }
    if (player.currentlevel === 9) {
        for (let i = 0; i < squareElems.length; i++) {
            squareElems[i].classList.remove('five');
            squareElems[i].classList.add('six');
        }
    }
    if (player.currentlevel === 12) {
        for (let i = 0; i < squareElems.length; i++) {
            squareElems[i].classList.remove('six');
            squareElems[i].classList.add('seven');
        }
    }
    if (player.currentlevel === 15) {
        for (let i = 0; i < squareElems.length; i++) {
            squareElems[i].classList.remove('seven');
            squareElems[i].classList.add('eight');
        }
    }
}

// Reset squares when starting a new game
const resetSquares = () => {
    let allRows = document.querySelectorAll('#squares > .row');
    let squareElems = document.querySelectorAll('div[class~="square"]');  
    for (let i = 0; i < allRows.length; i++) {
        let allRows = document.querySelectorAll('#squares > .row');
        let squareElems = document.querySelectorAll('div[class~="square"]');  
        if (allRows.length > 3) {
            allRows[allRows.length-1].remove();
        }
        if (squareElems.length > 9) {
            rowOne.removeChild(rowOne.lastChild)
            rowTwo.removeChild(rowTwo.lastChild)
            rowThree.removeChild(rowThree.lastChild)
        }
    }
 
    for (let i = 0; i < squareElems.length; i++) {
        squareElems[i].classList.remove('four', 'five', 'six', 'seven', 'eight');
    }

    resetSquareIDs();
}

// Reset squareIDs
const resetSquareIDs = () => {
    let squareElems = document.querySelectorAll('div[class~="square"]'); 
    for (let i = 0; i < squareElems.length; i++) {
        squareElems[i].id = (i+1);
    }
}



// Reset game
const resetGame = () => {
    player.patternlength = 3;
    player.progress = false;
    player.currentlevel = 1;
    player.numberofsquares = 9;
    player.livesremaining = 3;
    player.inputpause = true;
}

// Resets game display
const resetGameDisplay = () => {
    gameOverDisplay.classList.remove('visible');
    gameOverDisplay.classList.add('hidden');
    startGameButton.style.visibility = 'hidden';
    heartTwo.className = 'bi bi-suit-heart-fill';
    heartTwoPath.setAttribute('d', 'M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1z');
    heartThree.className = 'bi bi-suit-heart-fill';
    heartThreePath.setAttribute('d', 'M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1z');
    setTimeout(function() {
        gameDisplay.classList.remove('hidden');
        gameDisplay.classList.add('visible');
        gameDisplay.style.display = 'block';
    }, 500)
}

// End game
const gameOver = () => {
    gameDisplay.classList.add('hidden');
    levelReachedDisplay.innerHTML = player.currentlevel;
    setTimeout(function() {
        gameDisplay.style.display = 'none';
        gameOverDisplay.classList.remove('hidden');
        gameOverDisplay.classList.add('visible');
    }, 500)
}


// Save high score


// Cookies