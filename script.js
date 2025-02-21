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
let cactusCount = 0;
let consecutiveJumps = 0; // Nuova variabile per tracciare i salti consecutivi
let gameActive = false;

// Funzione per iniziare il gioco
function startGame() {
    resetLives();
    resetScore();
    cactusCount = 0;
    startScreen.style.display = 'none';
    gameArea.style.display = 'block';
    jumpButton.style.display = 'block';
    gameActive = true;

    setTimeout(() => {
        generateCactus(); // Genera il primo cactus
    }, 1000); // Ritardo iniziale
}

let dinoFrame = 4; // Inizia dal 4° frame (indice 3 perché parte da 0)

// Funzione per animare il dinosauro
function animateDino() {
    if (isJumping) return; // Non animare la corsa durante il salto

    dinoFrame = (dinoFrame + 1) % 7 + 3;
    const xOffset = dinoFrame * 72; // Ogni frame è largo 72px
    document.getElementById('dino').style.backgroundPosition = `-${xOffset}px 0`;
}

// Animazione della corsa: esegui ogni 100ms
setInterval(animateDino, 100);

// Funzione per gestire il salto
function jump() {
    if (isJumping) return; // Evita salti multipli

    isJumping = true;
    const dino = document.getElementById('dino');

    // Cambia frame al 19° (indice 18)
    dino.style.backgroundPosition = `${-18 * 24}px 0`;

    // Simula il salto
    let jumpHeight = 0;
    const jumpInterval = setInterval(() => {
        if (jumpHeight < 100) {
            jumpHeight += 5;
            dino.style.bottom = `${10 + jumpHeight}px`;
        } else {
            clearInterval(jumpInterval);
            descend();
        }
    }, 20);

    // Funzione per la discesa
    function descend() {
        const descendInterval = setInterval(() => {
            if (jumpHeight > 0) {
                jumpHeight -= 5;
                dino.style.bottom = `${10 + jumpHeight}px`;
            } else {
                clearInterval(descendInterval);
                isJumping = false; // Ritorna alla corsa
            }
        }, 20);
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
    if (!gameActive) return;

    const cactus = document.createElement('div');
    cactus.classList.add('cactus');
    cactusCount++;

    // Determina il tipo di cactus
    let cactusType;
    if (cactusCount > 5) {
        const randomType = Math.random();
        if (consecutiveJumps >= 10 && Math.random() < 0.1) {
            cactusType = 'ultrafast'; // Cactus ultraveloce
        } else if (randomType < 0.5) {
            cactusType = 'small'; // Cactus piccolo
        } else if (randomType < 0.8) {
            cactusType = 'large'; // Cactus grande
        } else {
            cactusType = 'wide'; // Cactus largo
        }
    } else {
        cactusType = 'small'; // Solo cactus piccoli prima del quinto
    }

    // Applica la classe al cactus
    cactus.classList.add(cactusType);
    cactus.style.left = '100%';
    gameArea.appendChild(cactus);
    moveCactus(cactus, cactusType);

    // Genera il prossimo cactus dopo un intervallo casuale
    const nextCactusTime = Math.random() * (2000 - 1000) + 800; // Da 1 a 2 secondi
    setTimeout(generateCactus, nextCactusTime);
}

// Funzione per muovere il cactus
function moveCactus(cactus, cactusType) {
    let leftPosition = 100;

    // Velocità del cactus in base al tipo
    let speed;
    if (cactusType === 'ultrafast') {
        speed = 4; // Velocità più alta per i cactus ultraveloci
    } else if (Math.random() < 0.3) {
        speed = 3; // Velocità casuale: 30% dei cactus sono più veloci
    } else {
        speed = 2; // Velocità normale
    }

    const interval = setInterval(() => {
        leftPosition -= speed; // Usa la velocità determinata
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





/*function showGameOverScreen() {
    const gameOverText = document.getElementById('gameOverText');
    const gameOverImage = document.getElementById('gameOverImage');
    const restartButton = document.getElementById('restartGame');

    // Mostra il contenitore del Game Over
    document.getElementById('gameOverScreen').style.display = 'block';

    // Reset scritta e immagine
    gameOverText.textContent = "Beccati questo";
    gameOverImage.style.display = 'none';
    restartButton.style.display = 'none';

    // Aggiungi i puntini di sospensione
    let dots = "";
    let dotInterval = setInterval(() => {
        if (dots.length < 3) {
            dots += ".";
        } else {
            clearInterval(dotInterval);

            // Mostra l'immagine "circle"
            setTimeout(() => {
                gameOverImage.style.display = 'block';

                // Mostra il pulsante "OK" dopo 1 secondo
                setTimeout(() => {
                    restartButton.style.display = 'block';
                }, 1000);
            }, 1000);
        }
        gameOverText.textContent = `Beccati questo${dots}`;
    }, 500);
}*/
function showGameOverScreen() {
    const gameOverText = document.getElementById('gameOverText');
    const gameOverImage = document.getElementById('gameOverImage');
    const restartButton = document.getElementById('restartGame');

    // Mostra il contenitore del Game Over
    document.getElementById('gameOverScreen').style.display = 'block';

    // Mostra "Game Over" per 1.5 secondi
    gameOverText.textContent = "Game Over";
    gameOverImage.style.display = 'none';
    restartButton.style.display = 'none';

    setTimeout(() => {
        // Cambia il testo in "Beccati questo"
        gameOverText.textContent = "Beccati questo";
        let dots = "";
        let dotInterval = setInterval(() => {
            if (dots.length < 3) {
                dots += ".";
            } else {
                clearInterval(dotInterval);

                // Mostra l'immagine "circle"
                setTimeout(() => {
                    gameOverImage.style.display = 'block';

                    // Mostra il pulsante "Restart" dopo 1 secondo
                    setTimeout(() => {
                        restartButton.style.display = 'block';
                    }, 1000);
                }, 1000);
            }
            gameOverText.textContent = `Beccati questo${dots}`;
        }, 500);
    }, 1500); // Mostra "Game Over" per 1.5 secondi prima di "Beccati questo..."
}

function resetGame() {
    // Ripristina le variabili di gioco
    lives = 3;
    score = 0;
    cactusCount = 0;
    consecutiveJumps = 0;
    gameActive = false;

    // Aggiorna il contatore delle vite e del punteggio
    updateLives();
    resetScore();

    // Rimuovi tutti i cactus
    const cacti = document.querySelectorAll('.cactus');
    cacti.forEach(cactus => cactus.remove());

    // Nascondi lo schermo di Game Over e mostra lo schermo di start
    document.getElementById('gameOverScreen').style.display = 'none';
    startScreen.style.display = 'flex';
    gameArea.style.display = 'none';
    jumpButton.style.display = 'none';

    // Ripristina il dinosauro
    const dino = document.getElementById('dino');
    dino.style.bottom = '10px'; // Riporta il dinosauro alla posizione iniziale
    dino.style.backgroundPosition = '-72px 0'; // Frame iniziale per la corsa

    // Ripristina l'animazione del dinosauro
    isJumping = false;
    isHoldingJump = false;
}




// Funzione per incrementare il punteggio
function incrementScore() {
    score++;
    scoreDisplay.textContent = `Punti: ${score}`;
    consecutiveJumps++; // Incrementa i salti consecutivi
}

// Funzione per perdere una vita
function loseLife() {
    lives--;
    consecutiveJumps = 0; // Resetta i salti consecutivi quando si perde una vita
    updateLives();
    gameActive = false; // Pausa temporanea

    if (lives > 0) {
        alert(`Hai perso una vita! Vite rimaste: ${lives}`);

        setTimeout(() => {
            gameActive = true; // Riprendi il gioco
            generateCactus(); // Genera un nuovo cactus
        }, 1500); // Ritardo di 1,5 secondi
    } else {
      if (lives === 0) {
        clearInterval(gameInterval); // Ferma il gioco
        showGameOverScreen(); // Mostra la sequenza di Game Over
      }
        //gameOver();
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
    gameActive = false;
    gameArea.style.display = 'none';
    jumpButton.style.display = 'none';
    startScreen.style.display = 'flex';

    // Rimuovi tutti i cactus
    const cacti = document.querySelectorAll('.cactus');
    cacti.forEach(cactus => cactus.remove());
}

// Event listener per il bottone "Start"
startButton.addEventListener('click', startGame);
document.getElementById('restartGame').addEventListener('click', () => {
    resetGame(); // Reset del gioco
});
