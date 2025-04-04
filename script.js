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
let playerName = ""; // Variabile per memorizzare il nome
let cactusTimeoutId = null;

// Funzione per iniziare il gioco
function startGame() {
    playerName = document.getElementById("playerName").value.trim();

    // Evita di avviare il gioco se è già attivo
    if (gameActive) return;
    
    resetLives();
    resetScore();
    cactusCount = 0;
    startScreen.style.display = 'none';
    gameArea.style.display = 'block';
    jumpButton.style.display = 'block';
    gameActive = true;

    // Cancella cactus precedenti
    if (cactusTimeoutId) {
        clearTimeout(cactusTimeoutId);
    }

    // Inizia a generare cactus dopo 1s
    cactusTimeoutId = setTimeout(() => {
        generateCactus();
    }, 1500);

    /*
    setTimeout(() => {
        generateCactus(); // Genera il primo cactus
    }, 1000); // Ritardo iniziale*/
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
    cactusTimeoutId = setTimeout(generateCactus, nextCactusTime);
    //setTimeout(generateCactus, nextCactusTime);
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

function enterFullscreen() {
    const elem = document.documentElement; // Rende l'intera pagina fullscreen
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { // Per Firefox
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { // Per Chrome, Safari e Opera
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { // Per Edge
        elem.msRequestFullscreen();
    }
}
document.getElementById("fullscreenButton").addEventListener("click", enterFullscreen);

function showGameOverScreen() {
    const gameOverText = document.getElementById('gameOverText');
    const gameOverImage = document.getElementById('gameOverImage');
    const restartButton = document.getElementById('restartGame');

    document.getElementById('gameOverScreen').style.display = 'block';

    if (playerName.toLowerCase() === " ") {
        // Sequenza speciale per "Lara"
        gameOverText.textContent = "Beccati questo";
        gameOverImage.style.display = 'none';
        restartButton.style.display = 'none';

        let dots = "";
        let dotInterval = setInterval(() => {
            if (dots.length < 3) {
                dots += ".";
            } else {
                clearInterval(dotInterval);

                setTimeout(() => {
                    gameOverImage.style.display = 'block';

                    setTimeout(() => {
                        restartButton.style.display = 'block';
                    }, 1000);
                }, 1000);
            }
            gameOverText.textContent = `Beccati questo${dots}`;
        }, 500);
    } else {
        // Normale schermata di Game Over per tutti gli altri nomi
        gameOverText.textContent = "Game Over!";
        gameOverImage.style.display = 'none';
        restartButton.style.display = 'block';
    }
} //funzione modificata

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
/*function loseLife() {
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
} *///originale

function loseLife() {
    lives--;
    consecutiveJumps = 0; // Resetta i salti consecutivi quando si perde una vita
    updateLives();
    gameActive = false; // Pausa temporanea

    if (lives > 0) {
        // Mostra il popup personalizzato invece di alert()
        document.getElementById('remainingLives').textContent = lives;
        document.getElementById('lifeLostMessage').style.display = 'block';
    } else {
        clearInterval(gameInterval); // Ferma il gioco
        saveScore(score);
        showGameOverScreen(); // Mostra la sequenza di Game Over
    }
}

// Funzione per chiudere il popup e riprendere il gioco senza uscire dal fullscreen
document.getElementById("closePopup").addEventListener("click", function () {
    document.getElementById("lifeLostMessage").style.display = "none";
    gameActive = true; // Riprende il gioco
    enterFullscreen(); // Rientra in fullscreen se è uscito
    setTimeout(generateCactus, 1500); // Aspetta 1.5s prima di generare un nuovo cactus
});


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



//
// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set, get, child, update } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyB4hmY1DIjID2DuYyiXTFZDUP3dNIU8V1s",
    authDomain: "dino-8148f.firebaseapp.com",
    databaseURL: "https://dino-8148f-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "dino-8148f",
    storageBucket: "dino-8148f.appspot.com",
    messagingSenderId: "250616453153",
    appId: "1:250616453153:web:bbf29808a8b869a0a9eb60",
    measurementId: "G-PW9C89WJ74"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Elementi della classifica
const leaderboard = document.getElementById("leaderboard");
const playerNameInput = document.getElementById("playerName");
//let playerName = "";

// Funzione per aggiornare la classifica
function updateLeaderboard() {
    const leaderboardRef = ref(db, "leaderboard");
    get(leaderboardRef).then((snapshot) => {
        if (snapshot.exists()) {
            const scores = Object.entries(snapshot.val()).map(([name, score]) => ({ name, score }));
            scores.sort((a, b) => b.score - a.score);
            const topScores = scores.slice(0, 3);

            leaderboard.innerHTML = "<h2>🏆 Classifica 🏆</h2>";
            topScores.forEach((entry, index) => {
                let medal = '';
                switch (index) {
                    case 0:
                        medal = '🥇';
                        break;
                    case 1:
                        medal = '🥈';
                        break;
                    case 2:
                        medal = '🥉';
                        break;
                }
                leaderboard.innerHTML += `<p>${index + 1}. ${entry.name} - ${entry.score} punti</p>`;
            });
        } else {
            leaderboard.innerHTML = "<p>Nessun punteggio registrato</p>";
        }
    });
}



// Funzione per salvare il punteggio
function saveScore(score) {
    if (playerName.trim() === "") return;

    const playerRef = ref(db, "leaderboard/" + playerName);
    get(playerRef).then((snapshot) => {
        if (snapshot.exists()) {
            const bestScore = snapshot.val();
            if (score > bestScore) {
                set(playerRef, score);
            }
        } else {
            set(playerRef, score);
        }
        updateLeaderboard();
    });
}

// Gestire l'inserimento del nome
document.getElementById("startButton").addEventListener("click", () => {
    playerName = playerNameInput.value.trim();
    if (!playerName) {
        alert("Inserisci un nome per giocare!");
        return;
    }
    startGame();
});



updateLeaderboard(); // Carica la classifica inizialmente
