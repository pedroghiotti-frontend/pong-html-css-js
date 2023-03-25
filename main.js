document.addEventListener("keydown", (e) =>
{
    console.log(e.key);
    switch(e.key.toLocaleLowerCase())
    {
        case ' ':
            StartGame();
            break;
        case 'w':
            p1Input = -1;
            break;
        case 's':
            p1Input = 1;
            break;
        case 'arrowup':
            p2Input = -1;
            break;
        case 'arrowdown':
            p2Input = 1;
            break;
        case 'q':
            P1Hit();
            break;
        case 'control':
            P2Hit();
            break;
    }
});

document.addEventListener("keyup", (e) =>
{
    switch(e.key.toLocaleLowerCase())
    {
        case 'w':
            p1Input = 0;
            break;
        case 's':
            p1Input = 0;
            break;
        case 'arrowup':
            p2Input = 0;
            break;
        case 'arrowdown':
            p2Input = 0;
            break;
    }
});

let ball = document.querySelector('.ball');
let p1 = document.querySelector('#p1');
let p2 = document.querySelector('#p2');
let p1ScoreText = document.querySelector('#p1Score');
let p2ScoreText = document.querySelector('#p2Score');
let prompt = document.querySelector('.prompt');

let ballRadius = 10;
let pSize = [15, 120];

let ballPos = [0, 0];
let ballDir = [0, 0];
let ballSpeed = 5;

let hitRange = 30;

let p1Pos = 0;
let p2Pos = 0;
let pSpeed = 2;

let p1Input = 0;
let p2Input = 0;

let gameState = 0;

let p1Score = 0;
let p2Score = 0;

ResetGameState();

function HandlePlayerMovement()
{
    HandleP1Movement();
    HandleP2Movement();
}
function HandleP1Movement()
{
    if(p1Input < 0 && p1Pos - (pSize[1] / 2) < -window.innerHeight / 2) return;
    if(p1Input > 0 && p1Pos + (pSize[1] / 2) > window.innerHeight / 2) return;

    p1Pos += p1Input * pSpeed;
    p1.setAttribute("style", `width: ${pSize[0]}px; height: ${pSize[1]}px; transform: translate( 0px, calc(-50% + ${p1Pos}px)`);
}
function HandleP2Movement()
{
    if(p2Input < 0 && p2Pos - (pSize[1] / 2) < -window.innerHeight / 2) return;
    if(p2Input > 0 && p2Pos + (pSize[1] / 2) > window.innerHeight / 2) return;

    p2Pos += p2Input * pSpeed;
    p2.setAttribute("style", `width: ${pSize[0]}px; height: ${pSize[1]}px; transform: translate( 0px, calc(-50% + ${p2Pos}px)`);
}
function HandleBallMovement()
{
    ballPos = [ ballPos[0] + (ballDir[0] * ballSpeed), ballPos[1] + (ballDir[1] * ballSpeed) ];
    ball.setAttribute("style", `width: ${2 * ballRadius}px; height: ${2 * ballRadius}px; transform: translate( calc(-50% + ${ballPos[0]}px), calc(-50% + ${ballPos[1]}px)`);
}

function HandleP1BallCollision()
{
    if(!(ballPos[1] < p1Pos + (pSize[1] / 2) && ballPos[1] > p1Pos - (pSize[1] / 2))) return;
    if(!(ballPos[0] - ballRadius < (-window.innerWidth / 2) + 10 + (pSize[0] / 2) && ballPos[0] - ballRadius > (-window.innerWidth / 2) + 10 - (pSize[0] / 2))) return;
    
    ballPos = [(-window.innerWidth/2) + 10 + ballRadius + pSize[0]/2, ballPos[1]];
    ballDir = [-1 * ballDir[0], ballDir[1]];
}
function HandleP2BallCollision()
{
    if(!(ballPos[1] < p2Pos + (pSize[1] / 2) && ballPos[1] > p2Pos - (pSize[1] / 2))) return;
    if(!(ballPos[0] + ballRadius > (window.innerWidth / 2) - 10 - (pSize[0] / 2) && ballPos[0] + ballRadius < (window.innerWidth / 2) - 10 + (pSize[0] / 2))) return;
    
    ballPos = [(window.innerWidth/2) - 10 - ballRadius - pSize[0]/2, ballPos[1]];
    ballDir = [-1 * ballDir[0], ballDir[1]];
}
function HandleBorderBallCollision()
{
    if(Math.abs(ballPos[1]) > ( (window.innerHeight / 2) - ballRadius / 2))
    {
        ballDir = [ballDir[0],-1 * ballDir[1]];
    }
}

function P1Hit()
{
    if(!(ballPos[1] < p1Pos + (pSize[1] / 2) && ballPos[1] > p1Pos - (pSize[1] / 2))) return;
    if(!(ballPos[0] - ballRadius < (-window.innerWidth / 2) + 10 + (pSize[0] / 2) + hitRange && ballPos[0] - ballRadius > (-window.innerWidth / 2) + 10 - (pSize[0] / 2) - hitRange)) return;

    newDir = [-ballDir[0] + 1, ballDir[1]];
    newDirMagnitude = Math.sqrt(Math.pow(newDir[0], 2) + Math.pow(newDir[1], 2));
    newDirNormalized = [newDir[0] / newDirMagnitude, newDir[1] / newDirMagnitude];

    ballDir = newDirNormalized;
}
function P2Hit()
{
    if(!(ballPos[1] < p2Pos + (pSize[1] / 2) && ballPos[1] > p2Pos - (pSize[1] / 2))) return;
    if(!(ballPos[0] + ballRadius > (window.innerWidth / 2) - 10 - (pSize[0] / 2) - hitRange && ballPos[0] + ballRadius < (window.innerWidth / 2) - 10 + (pSize[0] / 2) + hitRange)) return;
    
    newDir = [-ballDir[0] - 1, ballDir[1]];
    newDirMagnitude = Math.sqrt(Math.pow(newDir[0], 2) + Math.pow(newDir[1], 2));
    newDirNormalized = [newDir[0] / newDirMagnitude, newDir[1] / newDirMagnitude];
    
    ballDir = newDirNormalized;
}

function HandleScore()
{
    if(ballPos[0] + ballRadius < -(window.innerWidth / 2))
    {
        p2Score++;
        ResetGameState();
    }
    if(ballPos[0] - ballRadius > (window.innerWidth / 2))
    {
        p1Score++;
        ResetGameState();
    }

    UpdateScoreUI();
}
function UpdateScoreUI()
{
    p1ScoreText.innerHTML = p1Score;
    p2ScoreText.innerHTML = p2Score;
}
function ResetGameState()
{
    ballDir = RandomDir();

    ballPos = [0, 0];
    ball.setAttribute("style", `visibility: hidden; width: ${2 * ballRadius}px; height: ${2 * ballRadius}px; transform: translate(${ballPos[0] - ballRadius}px, ${ballPos[1] - ballRadius}px`);
    
    p1Pos = 0;
    p1.setAttribute("style", `width: ${pSize[0]}px; height: ${pSize[1]}px; transform: translate( 0px, calc(-50% + ${p1Pos}px)`);
    p2Pos = 0;
    p2.setAttribute("style", `width: ${pSize[0]}px; height: ${pSize[1]}px; transform: translate( 0px, calc(-50% + ${p2Pos}px)`);
    
    prompt.setAttribute("style", "visibility: visible;");
    
    gameState = 0;
}
function StartGame()
{
    gameState = 1;
    prompt.setAttribute("style", "visibility: hidden;");
}

function RandomDir()
{
    let x = Math.random() * 2 - 1;
    let y = Math.random() * 2 - 1;
    let magnitude = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    let dirNormalized = [x / magnitude, y / magnitude];

    return dirNormalized;
}

window.main = () =>
{
    window.requestAnimationFrame(main);

    switch(gameState)
    {
        case 0:
            break;

        case 1:

            HandlePlayerMovement();
            HandleBallMovement();
            
            HandleP1BallCollision();
            HandleP2BallCollision();
            HandleBorderBallCollision();

            HandleScore();

            break;
    }
};


main();