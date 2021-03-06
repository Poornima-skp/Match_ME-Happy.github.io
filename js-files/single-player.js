//  Setting up a class to get the audio and creating methods for when to play and stop music

class AudioController {
    constructor() {
        this.bgMusic = new Audio('../Attachments/Audio/game-audio.mp3');
        this.flipSound = new Audio('../Attachments/Audio/flip.wav');
        this.bgMusic.volume = 0.7;
        this.bgMusic.loop = true;
    }
    startMusic() {
        this.bgMusic.play();
    }
    stopMusic() {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }
    flip() {
        this.flipSound.play();
    }
    victory() {
        this.stopMusic();
    }
    gameOver() {
        this.stopMusic();
    }
}

// Creating a class to start and implement the actions for the game 

class MatchMe {
    constructor(totalTime, cards) {
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById('time-remaining')
        this.ticker = document.getElementById('flips');
        this.audioController = new AudioController();

    }

//  Method to Start the Game

    startGame() {
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.cardToCheck = null;
        this.matchedCards = [];
        this.busy = true;
        setTimeout(() => {
            this.audioController.startMusic();
            this.shuffleCards(this.cardsArray);
            this.countdown = this.startCountdown();
            this.busy = false;
        }, 500)
        this.hideCards();
        this.timer.innerText = this.timeRemaining;
        this.ticker.innerText = this.totalClicks;
    }

//  Method to calculate the time taken for the game by counting down from the allocated time limit

    startCountdown() {
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if (this.timeRemaining === 0)
                this.gameOver();

        }, 1000);
    }

//  A Game Over method to be called if not able to complete within the given time frame

    gameOver() {

        clearInterval(this.countdown);
        this.audioController.gameOver();
        window.location.href = "lost.html"

    }

//  A Victory method to be called if matched all the cards within the given time frame

    victory() {
        clearInterval(this.countdown);
        this.audioController.victory();
        window.location.href = "won.html"
    }

// Rule applied to hide the cards if the selected cards do not match

    hideCards() {
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        });
    }

// Checking if the fliped cards match along with addind the number of clicks

    flipCard(card) {
        if (this.canFlipCard(card)) {
            this.audioController.flip();
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            card.classList.add('visible');

            if (this.cardToCheck) {
                this.checkForCardMatch(card);
            } else {
                this.cardToCheck = card;
            }
        }
    }

    // Checking if cards are matched. If matched go to cardmatch pile if not card mismatch pile

    checkForCardMatch(card) {
        if (this.getCardType(card) === this.getCardType(this.cardToCheck))
            this.cardMatch(card, this.cardToCheck);
        else
            this.cardMismatch(card, this.cardToCheck);

        this.cardToCheck = null;
    }

    // Writing logic to see if all cards are matched to end the game


    cardMatch(card1, card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        
        if (this.matchedCards.length === this.cardsArray.length)
            this.victory();
    }

    // Writng a rule to Flip the cards back if they are not a match

    cardMismatch(card1, card2) {
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 1000);
    }

// Shuffling the cards to display for the game

    shuffleCards(cardsArray) {
        for (let i = cardsArray.length - 1; i > 0; i--) {
            let randIndex = Math.floor(Math.random() * (i + 1));
            cardsArray[randIndex].style.order = i;
            cardsArray[i].style.order = randIndex;
        }
    }
    getCardType(card) {
        return card.getElementsByClassName('card-value')[0].src;
    }
    canFlipCard(card) {
        // return true;
        return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
    }
}

// Calling the function ready to invoke the game and is started with an on click event inside the function

 ready();

function ready() {
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    const cards = Array.from(document.getElementsByClassName('card'));
    const game = new MatchMe(45, cards);

    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            game.startGame();
        });
    });

//  For each card click the flipCard method is called to check
    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card);
        });
    });
}


