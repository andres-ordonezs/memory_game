"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 1000;
/* const COLORS = [
  "red", "blue", "green", "orange", "purple",
  "red", "blue", "green", "orange", "purple"
]; */

const COLORS = [
  'url(photos/photo1.JPG)', 'url(photos/photo2.png)', 'url(photos/photo3.png)', 'url(photos/photo4.png)', 'url(photos/photo6.png)',
  'url(photos/photo1.JPG)', 'url(photos/photo2.png)', 'url(photos/photo3.png)', 'url(photos/photo4.png)', 'url(photos/photo6.png)'
];

const gameBoard = document.getElementById("card-container");

let reStartBtn = document.getElementById("reStartBtn");

let cardContainer = document.getElementById('card-container');

let buttonContainer = document.getElementById('header-container--buttons');

let currentScore = document.getElementById('current-score');

let bestScore = document.getElementById('best-score');

let overlay = document.getElementById('overlay');

currentScore.innerText = 0;

bestScore.innerText = 0;

let currentColor = '';

let cardsToMatch = COLORS.length;

let currentCards = 0;

let bestScoreCounter = Infinity;

let currentScoreCounter = 0;




/** Shuffle array items in-place and return shuffled array. */

function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - a click event listener for each card to handleCardClick
 */

function createCards(colors) {
  for (let color of colors) {
    let card = document.createElement('div');
    let cardInner = document.createElement('div');
    let cardFront = document.createElement('div');
    let cardBack = document.createElement('div');

    cardInner.append(cardFront);
    cardInner.append(cardBack);
    cardInner.classList.add('card-inner');
    cardFront.classList.add('card-front');
    cardFront.innerHTML = '<p>🐶</p>';

    cardBack.classList.add('card-back');

    cardInner.append(cardFront);
    cardInner.append(cardBack);
    /* cardBack.style.backgroundColor = color; */
    cardBack.style.backgroundImage = color;
    card.append(cardInner);

    card.classList.add('card');

    gameBoard.append(card);
  }
}

/** Flip a card face-up. */
function flipCard(card) {
  // ... you need to write this ...
  card.parentElement.parentElement.classList.add('flip-card');
}

/** Flip a card face-down. */
function unFlipCard(card) {
  // ... you need to write this ...
  card.parentElement.parentElement.classList.remove('flip-card');
}

/** Handle clicking on a card: this could be first-card or second-card. */

function handleCardClick(event) {
  // ... you need to write this ..
  let cardIsFlipped = event.target.parentElement.parentElement.classList.contains('flip-card');

  if (event.target.classList.contains('card-front')) {
    if (currentCards === 0) {
      flipCard(event.target);
      /* currentColor = event.target.nextSibling.style.backgroundColor; */
      currentColor = event.target.nextSibling.style.backgroundImage;
      currentCards++;
    } else if (cardIsFlipped && currentCards === 1) {
      unFlipCard(event.target);
      currentCards = 0;
      currentColor = '';
    } else if (!cardIsFlipped && currentCards === 1) {
      flipCard(event.target);
      currentCards = 2;
      cardsMatch(event);
    }
  }

}

/* Compare card colors
-> Unflips cards if they don't match*/
let cardsMatch = (event) => {
  let flippedCards = document.getElementsByClassName('flip-card');
  /* let colorsMatch = event.target.nextSibling.style.backgroundColor === currentColor; */
  let colorsMatch = event.target.nextSibling.style.backgroundImage === currentColor;

  currentScoreCounter++;

  if (!colorsMatch) {
    setTimeout(unflipCards, 1000);

  } else {

    currentCards = 0;
    for (let card of flippedCards) {
      card.classList.add('matched');
    }

    let matchedCards = document.getElementsByClassName('matched');

    if (matchedCards.length === cardsToMatch) {
      bestScoreCounter = bestScoreCounter < currentScoreCounter ? bestScoreCounter : currentScoreCounter;
      setTimeout(setBestScore, 1010);
      overlay.innerHTML = '<h1></br>You matched them all! </br>Click on the Restart button to start again!</h1>';
      overlay.style.display = 'block';
    }
  }
  setTimeout(increaseCurrentScore, 500);
};

/* Sets best score */
let setBestScore = () => {
  bestScore.innerText = bestScoreCounter;
};


/* Unflip unmatching cards */
let unflipCards = () => {
  let flippedCards = document.getElementsByClassName('flip-card');
  let unmatchedCards = Array.from(flippedCards).filter(card => {
    return !card.classList.contains('matched');
  });

  for (let card of unmatchedCards) {
    card.classList.remove('flip-card');
  }
  currentCards = 0;
};


/* Handle Start button clicked */
let handleStartBtnClick = (event) => {

  overlay.style.display = "none";

  const colors = shuffle(COLORS);
  createCards(colors);
  event.target.remove();
  addRestartButton();
};

/* Handle the re-Start button clicked */
let handleReStartBtnClick = () => {
  overlay.style.display = 'none';
  currentScore.innerText = 0;
  currentScoreCounter = 0;
  removeCards();
  const colors = shuffle(COLORS);
  createCards(colors);

};

/* Remove Cards */
let removeCards = () => {
  let cards = gameBoard.getElementsByTagName('div');

  for (let i = cards.length - 1; i >= 0; i--) {
    cards[i].remove();
  }
};

/* Increase current Score */
let increaseCurrentScore = () => {
  currentScore.innerText++;
};

/* Add Start button once the DOM loades*/
document.addEventListener("DOMContentLoaded", (event) => {

  let startButton = document.createElement('button');
  startButton.classList.add('btn');
  startButton.classList.add('btn-success');
  startButton.classList.add('btn-lg');
  startButton.id = 'startBtn';
  startButton.innerText = 'Start';
  startButton.addEventListener("click", handleStartBtnClick);

  buttonContainer.append(startButton);
});


/* Add Restart button */
let addRestartButton = () => {
  let reStartButton = document.createElement('button');
  reStartButton.classList.add('btn');
  reStartButton.classList.add('btn-info');
  reStartButton.classList.add('btn-lg');
  reStartButton.id = 'reStartBtn';
  reStartButton.innerText = 'Restart';
  reStartButton.addEventListener("click", handleReStartBtnClick);

  buttonContainer.append(reStartButton);
};

/* Handle clicking on a card */
cardContainer.addEventListener("click", handleCardClick);