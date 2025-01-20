const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');
const gameArea = document.getElementById('gameArea');
const dino = document.getElementById('dino');
const jumpButton = document.getElementById('jumpButton');
const livesContainer = document.getElementById('livesContainer');
const scoreDisplay = document.getElementById('score');

let isJumping = false;
let isHoldingJump = false;
let score = 0;
let lives = 3;
let gameInterval;
let cactusInterval;
let difficultyLevel = 1;
let cactusCount = 0;

// Funzione per iniziare il gioco
function startGame() {
    resetLives();
    resetScore();
    difficultyLevel = 1;
    cactusCount = 0;
    startScreen.style.display = 'none';
    gameArea.style.display = 'block';
    jumpButton.style.display = 'block';

    setTimeout(() => {
        gameInterval = setInterval(generateCactus, 2000 / difficultyLevel);
    }, 1000); // Ritardo iniziale
}

// Funzione per gestire il salto
function jump() {
    if (!isJumping) {
        isJumping = true;
        let jumpHeight = 100;
        dino.style.transition = "none";
        dino.style.bottom = `${jumpHeight}px`;

        const jumpHoldInterval = setInterval(() => {
            if (isHoldingJump && jumpHeight < 150) {
                jumpHeight += 5;
                dino.style.bottom = `${jumpHeight}px`;
            } else {
                clearInterval(jumpHoldInterval);
            }
        }, 50);

        setTimeout(() => {
            dino.style.transition = "bottom 0.3s";
            dino.style.bottom = "0";
            isJumping = false;
        }, 500);
    }
}

// Gestire la pressione continua del tasto Jump
jumpButton.addEventListener('mousedown', () => {
    isHoldingJump = true;
});
jumpButton.addEventListener('mouseup', () => {
    isHoldingJump = false;
});
jumpButton.addEventListener('click', jump);

// Funzione per generare cactus
function generateCactus() {
    const cactus = document.createElement('div');
    cactus.classList.add('cactus');

    // Cambia dimensione del cactus in base al numero di cactus saltati
    cactusCount++;
    if (cactusCount <= 3) {
        cactus.style.height = '50px'; // Cactus piccoli per i primi tre
    } else {
        // Generazione casuale di cactus piccoli o grandi
        const isLarge = Math.random() > 0.5;
        cactus.style.height = isLarge ? '70px' : '50px';
    }

    cactus.style.left = '100%';
    gameArea.appendChild(cactus);
    moveCactus(cactus);
}

// Funzione per muovere il cactus
function moveCactus(cactus) {
    let leftPosition = 100;
    const interval = setInterval(() => {
        leftPosition -= 2; // Velocità del cactus
        cactus.style.left = `${leftPosition}%`;

        if (leftPosition <= 0) {
            clearInterval(interval);
            gameArea.removeChild(cactus);
            incrementScore();
        }

        if (leftPosition <= 10 && leftPosition >= 0 && !isJumping) {
            loseLife();
            clearInterval(interval);
            gameArea.removeChild(cactus);
        }
    }, 20);
}

// Funzione per incrementare il punteggio
function incrementScore() {
    score++;
    scoreDisplay.textContent = `Punti: ${score}`;
}

// Funzione per perdere una vita
function loseLife() {
    lives--;
    updateLives();
    clearInterval(gameInterval);

    if (lives > 0) {
        alert(`Hai perso una vita! Vite rimaste: ${lives}`);

        // Ritardo prima di riprendere il gioco
        setTimeout(() => {
            cactusCount = 0; // Resetta il conteggio dei cactus
            gameInterval = setInterval(generateCactus, 2000 / difficultyLevel);
        }, 1500);
    } else {
        gameOver();
    }
}

// Funzione per aggiornare il contatore delle vite
function updateLives() {
    let hearts = '';
    for (let i = 0; i < lives; i++) {
        hearts += '❤️';
    }
    for (let i = lives; i < 3; i++) {
        hearts += '🖤';
    }
    livesContainer.innerHTML = hearts;
}

// Funzione per resettare le vite
function resetLives() {
    lives = 3;
    updateLives();
}

// Funzione per resettare il punteggio
function resetScore() {
    score = 0;
    scoreDisplay.textContent = `Punti: ${score}`;
}

// Funzione per gestire il Game Over
function gameOver() {
    alert("Game Over! Hai perso tutte le vite.");
    clearInterval(gameInterval);
    gameArea.style.display = 'none';
    jumpButton.style.display = 'none';
    startScreen.style.display = 'flex';

    // Rimuovi tutti i cactus
    const cacti = document.querySelectorAll('.cactus');
    cacti.forEach(cactus => cactus.remove());
}

// Event listener per il bottone "Start"
startButton.addEventListener('click', startGame);
