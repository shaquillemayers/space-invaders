const playButton = document.querySelector('.play');
// const resetButton = document.querySelector('#reset');

let invaderSpeed;
let result = 0;
let level = 2;

playButton.addEventListener('click', function SpaceInvaders(){
    
    
    playButton.removeEventListener('click', SpaceInvaders);
    playButton.textContent = 'SHOOT!';
    
    
    
    const squares = document.querySelectorAll('.grid div');
    const resultDisplay = document.querySelector('#result');
    let width = 15;
    let currentShooterIndex = 202;
    let currentInvaderIndex = 0;
    let alienInvadersTakenDown = [];
    let direction = 1;
    if(invaderSpeed === undefined) {
        invaderSpeed = 300
    }
    let invaderId;
    console.log(invaderSpeed);

    

    // Reset logic

    function resetVariables(){
        //list of all the variables with original attributes here

        if(currentShooterIndex){
            squares.forEach(item => item.classList.remove('boom', 'shooter', 'laser'));
        }

        width = 15;
        currentInvaderIndex = 0;
        alienInvadersTakenDown = [];
        direction = 1;
        invaderId;
        currentShooterIndex = 202;
        return currentLaserIndex = currentShooterIndex;
        }
    
    // Play Again logic

    function playAgain() {
        let playAgainId;
        resetVariables();
        invaderSpeed = 300;
        result = 0;
        level = 2;
        resultDisplay.textContent = `Score:`;

       if(currentShooterIndex){
            currentShooterIndex = undefined;
        } 

        alienInvaders.forEach(invader => {
            squares[invader].classList.remove('invader');
            
        })
        playButton.addEventListener('click', SpaceInvaders);
        clearTimeout(playAgainId);
    }

    // Increment Level Logic

    function incrementLevel() {
        level +=1;
        let incrementLevelId;
        resetVariables();
        resultDisplay.textContent = `Score: ${result}`;
        invaderSpeed === undefined ? invaderSpeed = 300 : invaderSpeed -= 25
        

       if(currentShooterIndex){
            currentShooterIndex = undefined;
        } 

        alienInvaders.forEach(invader => {
            squares[invader].classList.remove('invader');
            
        })
        playButton.addEventListener('click', SpaceInvaders);
        clearTimeout(incrementLevelId);
    }


    //define the invaders

    const alienInvaders = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
        30, 31, 32, 33, 34, 35, 36, 37, 38, 39
    ]

    

    //draw the invaders
    alienInvaders.forEach( invader => {
        squares[currentInvaderIndex + invader].classList.add('invader');
    })

    //draw the shooter
    squares[currentShooterIndex].classList.add('shooter');

    //move shooter along a line - ERROR WITH SHOOTER AFTER WIN AND LOSS MAY BE FIXABLE HERE
    function moveShooter(e) {
        
        if (currentShooterIndex === undefined || currentShooterIndex === null) {
            return;
        }
        
        squares[currentShooterIndex].classList.remove('shooter');
        
       

        switch(e.keyCode) {
            case 37: 
                if ((currentShooterIndex % width) !== 0) currentShooterIndex -=1;
                break;
            case 39:
                if ((currentShooterIndex % width) < width -1 ) currentShooterIndex +=1;
                break;
        }

        squares[currentShooterIndex].classList.add('shooter');
    }

    document.addEventListener('keydown', moveShooter);
    

    //move alien invaders
    invaderId = setInterval(moveInvaders, invaderSpeed);

    function moveInvaders() {
        const leftEdge = alienInvaders[0] % width === 0;
        const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width -1;
    
        if ((leftEdge && (direction === -1)) || (rightEdge && (direction === 1))){
            direction = width;
        } else if (direction === width){
            if (leftEdge) direction = 1
            else direction = -1
        }
        
        for (let i = 0; i <= alienInvaders.length - 1; i++) {
            squares[alienInvaders[i]].classList.remove('invader');
        }

        for (let i = 0; i <= alienInvaders.length - 1; i++) {
            alienInvaders[i] += direction;
        }

        for (let i = 0; i <= alienInvaders.length - 1; i++) {
            if (!alienInvadersTakenDown.includes(i)){
                squares[alienInvaders[i]].classList.add('invader');
            }
        }
        
        //decide game over - invader hits shooter
        if (squares[currentShooterIndex].classList.contains('invader', 'shooter')){
            resultDisplay.textContent = 'Game Over';
            playButton.textContent = 'Play Again';
            squares[currentShooterIndex].classList.add('boom');
            clearInterval(invaderId);

            // on loss or victory, play again will clear the game and restart after the set number of seconds.

            playAgainId = setTimeout(playAgain, 3000);
        }

        //decide game over - invader hits bottom
        for (let i = 0; i <= alienInvaders.length -1; i++) {
            if(alienInvaders[i] > (squares.length - (width -1))) {
            resultDisplay.textContent = 'Game Over';
            playButton.textContent = 'Play Again';
            clearInterval(invaderId);

            
            playAgainId = setTimeout(playAgain, 3000);
            }
        }

        //win logic 

        if(alienInvadersTakenDown.length === alienInvaders.length){
            resultDisplay.textContent = 'Keep Going!';
            playButton.textContent = `Start Level ${level}`;
            clearInterval(invaderId);

        
            incrementLevelId = setTimeout(incrementLevel, 2000);
            
        }
    }

    //shoot at aliens
    function shoot(e){
        let laserId;
        let currentLaserIndex = currentShooterIndex;
        //move the laser from the shooter to the alien invader
        function moveLaser() {

            if (currentShooterIndex === undefined || currentShooterIndex === null) {
                return;
            }

            squares[currentLaserIndex].classList.remove('laser');
            currentLaserIndex -= width;
            squares[currentLaserIndex].classList.add('laser');

            if (squares[currentLaserIndex].classList.contains('invader')){
                squares[currentLaserIndex].classList.remove('laser', 'invader');
                squares[currentLaserIndex].classList.add('boom');

        // adding {} to the setTimeout function below causes the boom to fail. Why?

                setTimeout(() => 
                    squares[currentLaserIndex].classList.remove('boom'), 250
                );
                clearInterval(laserId);
                

                let alienTakenDown = alienInvaders.indexOf(currentLaserIndex);
                alienInvadersTakenDown.push(alienTakenDown);
                result +=10;
                resultDisplay.textContent = `Score: ${result}`;
            }

            if (currentLaserIndex < width) {
                clearInterval(laserId);
                setTimeout(() => squares[currentLaserIndex].classList.remove('laser'), 100);
            }
        }

        switch(e.keyCode) {
            case 32:
                laserId = setInterval(moveLaser, 100);
                break;
        }  
    }
        
    document.addEventListener('keydown', shoot);
});



