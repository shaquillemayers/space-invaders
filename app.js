/* 
  Future adjustments:

    High score for everyone!
*/

// Log fn
const log = (x) => console.log(x);

const body = document.querySelector("body");
const playButton = document.querySelector(".play");
// const resetButton = document.querySelector('#reset');

// display high score if it exists
const highScoreDisplay = document.getElementById("high-score");
let highScore = localStorage.getItem("High Score");
if (highScore) {
  highScoreDisplay.textContent = `High Score: ${highScore}`;
  log(highScore);
}

// localStorage.removeItem("High Score");

let invaderSpeed;
let result = 0;
let level = 2;

// Space Invaders fn
playButton.addEventListener("click", function SpaceInvaders() {
  playButton.removeEventListener("click", SpaceInvaders);
  playButton.textContent = "SHOOT!";

  const squares = document.querySelectorAll(".grid div");
  const resultDisplay = document.querySelector("#result");
  resultDisplay.textContent = `Score: ${result}`;

  highScore = localStorage.getItem("High Score");
  log(highScore);
  if (highScore) {
    highScoreDisplay.textContent = `High Score: ${highScore}`;
    log(highScore);
  }

  let width = 15;
  let currentShooterIndex = 202;
  let currentInvaderIndex = 0;
  let alienInvadersTakenDown = [];
  let direction = 1;
  if (invaderSpeed === undefined) {
    invaderSpeed = 300;
  }
  let invaderId;

  // Reset logic

  function resetVariables() {
    // list of all the variables with original attributes here

    if (currentShooterIndex) {
      squares.forEach((item) =>
        item.classList.remove("boom", "shooter", "laser")
      );
    }

    width = 15;
    currentInvaderIndex = 0;
    alienInvadersTakenDown = [];
    direction = 1;
    invaderId;
    currentShooterIndex = 202;
    return (currentLaserIndex = currentShooterIndex);
  }

  // Play Again logic

  function playAgain() {
    let playAgainId;
    resetVariables();
    invaderSpeed = 300;
    result = 0;
    level = 2;
    resultDisplay.textContent = `Score:`;

    if (currentShooterIndex) {
      currentShooterIndex = undefined;
    }

    alienInvaders.forEach((invader) => {
      squares[invader].classList.remove("invader");
    });
    playButton.addEventListener("click", SpaceInvaders);
    clearTimeout(playAgainId);
  }

  // Increment Level logic

  function incrementLevel() {
    level += 1;
    let incrementLevelId;
    resetVariables();
    resultDisplay.textContent = `Score: ${result}`;
    invaderSpeed === undefined ? (invaderSpeed = 300) : (invaderSpeed -= 25);

    if (currentShooterIndex) {
      currentShooterIndex = undefined;
    }

    alienInvaders.forEach((invader) => {
      squares[invader].classList.remove("invader");
    });
    playButton.addEventListener("click", SpaceInvaders);
    clearTimeout(incrementLevelId);
  }

  // define the invaders

  const alienInvaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 30,
    31, 32, 33, 34, 35, 36, 37, 38, 39,
  ];

  // draw the invaders
  alienInvaders.forEach((invader) => {
    squares[currentInvaderIndex + invader].classList.add("invader");
  });

  // draw the shooter
  squares[currentShooterIndex].classList.add("shooter");

  // move shooter along a line
  // arrows to move shooter on mobile
  const leftArrow = document.getElementById("left-arrow");
  const rightArrow = document.getElementById("right-arrow");
  let leftClicked;
  let rightClicked;

  function moveShooter(e) {
    if (currentShooterIndex === undefined || currentShooterIndex === null) {
      return;
    }

    squares[currentShooterIndex].classList.remove("shooter");

    if (body.offsetWidth > 1024) {
      switch (e.keyCode) {
        case 37:
          if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
          break;
        case 39:
          if (currentShooterIndex % width < width - 1) currentShooterIndex += 1;
          break;
      }
    } else {
      leftArrow.addEventListener("click", () => {
        leftClicked = true;
      });

      rightArrow.addEventListener("click", () => {
        rightClicked = true;
      });

      if (leftClicked) {
        leftClicked = false;
        if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
      } else if (rightClicked) {
        rightClicked = false;
        if (currentShooterIndex % width < width - 1) currentShooterIndex += 1;
      }
    }

    squares[currentShooterIndex].classList.add("shooter");
  }

  body.offsetWidth > 1024
    ? document.addEventListener("keydown", moveShooter)
    : document.addEventListener("click", moveShooter);

  // move alien invaders
  invaderId = setInterval(moveInvaders, invaderSpeed);

  function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0;
    const rightEdge =
      alienInvaders[alienInvaders.length - 1] % width === width - 1;

    if ((leftEdge && direction === -1) || (rightEdge && direction === 1)) {
      direction = width;
    } else if (direction === width) {
      if (leftEdge) direction = 1;
      else direction = -1;
    }

    for (let i = 0; i <= alienInvaders.length - 1; i++) {
      squares[alienInvaders[i]].classList.remove("invader");
    }

    for (let i = 0; i <= alienInvaders.length - 1; i++) {
      alienInvaders[i] += direction;
    }

    for (let i = 0; i <= alienInvaders.length - 1; i++) {
      if (!alienInvadersTakenDown.includes(i)) {
        squares[alienInvaders[i]].classList.add("invader");
      }
    }

    //decide game over - invader hits shooter
    if (squares[currentShooterIndex].classList.contains("invader", "shooter")) {
      resultDisplay.textContent = "Game Over";
      playButton.textContent = "Play Again";
      squares[currentShooterIndex].classList.add("boom");
      clearInterval(invaderId);

      // Set high score
      if (result > highScore) {
        localStorage.setItem("High Score", result);
      }

      // on loss or victory, play again will clear the game and restart after the set number of seconds.

      playAgainId = setTimeout(playAgain, 3000);
    }

    // decide game over - invader hits bottom
    for (let i = 0; i <= alienInvaders.length - 1; i++) {
      if (alienInvaders[i] > squares.length - (width - 1)) {
        resultDisplay.textContent = "Game Over";
        playButton.textContent = "Play Again";
        clearInterval(invaderId);

        // Set high score
        if (result > highScore) {
          localStorage.setItem("High Score", result);
        }

        playAgainId = setTimeout(playAgain, 3000);
      }
    }

    // win logic

    if (alienInvadersTakenDown.length === alienInvaders.length) {
      resultDisplay.textContent = "Keep Going!";
      playButton.textContent = `Start level ${level}`;
      clearInterval(invaderId);

      incrementLevelId = setTimeout(incrementLevel, 2000);
    }
  }

  // shoot at aliens
  function shoot(e) {
    let laserId;
    let currentLaserIndex = currentShooterIndex;
    // move the laser from the shooter to the alien invader
    function moveLaser() {
      if (currentShooterIndex === undefined || currentShooterIndex === null) {
        return;
      }

      squares[currentLaserIndex].classList.remove("laser");
      currentLaserIndex -= width;
      squares[currentLaserIndex].classList.add("laser");

      if (squares[currentLaserIndex].classList.contains("invader")) {
        squares[currentLaserIndex].classList.remove("laser", "invader");
        squares[currentLaserIndex].classList.add("boom");

        setTimeout(
          () => squares[currentLaserIndex].classList.remove("boom"),
          250
        );
        clearInterval(laserId);

        let alienTakenDown = alienInvaders.indexOf(currentLaserIndex);
        alienInvadersTakenDown.push(alienTakenDown);
        result += 10;
        resultDisplay.textContent = `Score: ${result}`;
      }

      if (currentLaserIndex < width) {
        clearInterval(laserId);
        setTimeout(
          () => squares[currentLaserIndex].classList.remove("laser"),
          100
        );
      }
    }

    // space bar for large screens, shoot buttons for small-medium screens

    if (body.offsetWidth > 1024) {
      switch (e.keyCode) {
        case 32:
          laserId = setInterval(moveLaser, 100);
          break;
      }
    } else {
      switch (playButton.textContent) {
        case "SHOOT!":
          laserId = setInterval(moveLaser, 100);
          break;
      }
    }
  }

  // activate game all screen sizes
  body.offsetWidth > 1024
    ? document.addEventListener("keydown", shoot)
    : playButton.addEventListener("click", shoot);
});
