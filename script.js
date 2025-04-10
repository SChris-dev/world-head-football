// canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1000;
canvas.height = 600;

// game

// loading images
const bgImage1 = new Image();
bgImage1.src = './Sprites/background1.jpg';

const ballImages = {
    ball1: new Image(),
    ball2: new Image()
};

ballImages.ball1.src = './Sprites/Ball 01.png';
ballImages.ball2.src = './Sprites/Ball 02.png';

let selectedBallImage = ballImages.ball1;

const characterNames = [
    'Character 01 - Brazil',
    'Character 02 - England',
    'Character 03 - Spain',
    'Character 04 - Japan',
    'Character 05 - Netherlands',
    'Character 06 - Portugal',
    'Character 07 - Germany',
    'Character 08 - Italy'
];

const animationTypes = [
    'Idle',
    'Jump',
    'Kick',
    'Move Backward',
    'Move Forward',
    'Falling Down'
];

const frameCounts = {
    'Idle': 18,
    'Kick': 9,
    'Falling Down': 5,
    'Jump': 5,
    'Move Backward': 10,
    'Move Forward': 10
}

// ball initialization
const ball = {
    x: canvas.width / 2 - 40,
    y: 300,
    width: 70,
    height: 70,
    velocityX: 0,
    velocityY: 0,
    gravity: 0.5,
    bounce: 0.7,
    groundY: 490,
    image: selectedBallImage
};


// ball functions

function checkBallCollision(player, ball) {
    const playerWidth = 100;
    const playerHeight = 150;

    return (
        player.x < ball.x + ball.width - 50 &&
        player.x + playerWidth + 25> ball.x &&
        player.y < ball.y + ball.height &&
        player.y + playerHeight > ball.y
    );
}


function bounceBallFromPlayer(player) {
    const ballLeft = ball.x;
    const ballRight = ball.x + ball.width;
    const ballTop = ball.y;
    const ballBottom = ball.y + ball.height;

    const playerLeft = player.x;
    const playerRight = player.x + player.width;
    const playerTop = player.y;
    const playerBottom = player.y + player.height;

    const isColliding = (
        ballRight > playerLeft &&
        ballLeft < playerRight &&
        ballBottom > playerTop &&
        ballTop < playerBottom
    );

    if (isColliding) {
        const playerCenterX = player.x + player.width / 2;
        const ballCenterX = ball.x + ball.width / 2;
        const offset = (ballCenterX - playerCenterX) / (player.width / 2);

        let forceX = offset * 6 + (player.velocityX || 0) * 0.5;
        let forceY = -Math.abs(ball.velocityY || 6) * 1.1;

        // 👟 Kick detection
        const KICK_ZONE = 100;
        const facingRight = player.velocityX >= 0;

        const kickLeft = facingRight
            ? playerRight
            : playerLeft - KICK_ZONE;

        const kickRight = facingRight
            ? playerRight + KICK_ZONE
            : playerLeft;

        const ballCenter = ball.x + ball.width / 2;
        const inKickZone = ballCenter >= kickLeft && ballCenter <= kickRight;

        if (player.isKicking && inKickZone) {
            forceX = facingRight ? 12 : -12;
            forceY = -25;
        }

        ball.velocityX = forceX;
        ball.velocityY = forceY;
    }
}


// characters initialization
const characters = {};

let totalToLoad = 0;
let loadedCount = 0;

for (const characterName of characterNames) {
    characters[characterName] = {};

    for (const animationName of animationTypes) {
        characters[characterName][animationName] = [];

        const frameCount = frameCounts[animationName];

        for (let i = 0; i < frameCount; i++) {
            const img = new Image();

            const frameName = `${animationName}_${i.toString().padStart(3, '0')}.png`;
            const path = `./Sprites/Characters/${characterName}/${animationName}/${frameName}`;

            img.src = path;

            img.onload = () => {
                loadedCount++;
                if (loadedCount === totalToLoad) {
                    console.log('all images loaded!');
                }
            }

            characters[characterName][animationName].push(img);
            totalToLoad++;
        }
    }
}

// characters animation & state
let animationSpeed = 50;

const player1 = {
    character: 'Character 01 - Brazil',
    x: 200,
    y: 350,
    width: 100,
    height: 150,
    animation: 'Idle',
    frame: 0,
    lastFrameTime: 0,
    groundY: 350,
    velocityY: 0,
    isJumping: false,
    isKicking: false,
};

const player2 = {
    character: 'Character 02 - England',
    x: 620,
    y: 350,
    width: 100,
    height: 150,
    animation: 'Idle',
    frame: 0,
    lastFrameTime: 0,
    groundY: 350,
    velocityY: 0,
    isJumping: false,
    isKicking: false,
};

function setAnimation(player, animationName) {
    if (player.animation !== animationName) {
        player.animation = animationName;
        player.frame = 0;
        player.lastFrameTime = 0;
    }
}


// draw background
function drawBackground() {
    if (!bgImage1.complete) return;

    ctx.drawImage(bgImage1, 0, 0, canvas.width, canvas.height);
}

// draw ball
function drawBall() {

    // Gravity
    ball.velocityY += 0.4; // Gravity strength

    // Update position
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Floor bounce
    const floor = 425;
    if (ball.y > floor) {
        ball.y = floor;
        ball.velocityY *= -0.8; // Lose some energy when hitting ground

        // Friction on ground
        ball.velocityX *= 0.9;

        // Stop bouncing if it's small enough
        if (Math.abs(ball.velocityY) < 1) {
            ball.velocityY = 0; // Let it stay bouncy forever
        }
    }

    // Left/right wall bounce
    if (ball.x < 0) {
        ball.x = 0;
        ball.velocityX *= -0.9;
    } else if (ball.x + ball.width > canvas.width) {
        ball.x = canvas.width - ball.width;
        ball.velocityX *= -0.9;
    }

    ctx.drawImage(ball.image, ball.x, ball.y, ball.width, ball.height);
}


// draw players

function drawPlayer(player, timestamp) {
    const frames = characters[player.character][player.animation];

    if (timestamp - player.lastFrameTime > animationSpeed) {
        player.lastFrameTime = timestamp;

        player.frame++;

        if (player.frame >= frames.length) {
            if (player.animation === 'Kick') {
                setAnimation(player, 'Idle');
            } else {
                player.frame = 0;
            }
        }
    }

    const frameImage = frames[player.frame];

    const shouldFlip = player === player2;
    const imgWidth = 170;
    const imgHeight = 170;

    ctx.save();

    if (shouldFlip) {
        ctx.translate(player.x + imgWidth, player.y);
        ctx.scale(-1, 1);
        ctx.drawImage(frameImage, 0, 0, imgWidth, imgHeight);
    } else {
        ctx.drawImage(frameImage, player.x, player.y, imgWidth, imgHeight);
    }

    ctx.restore();

    // ctx.fillstyle = 'red';
    // ctx.fillRect(player.x, player.y, 170, 170);

}

// event listeners

// player movement
const keys = {};

window.addEventListener('keydown', e => {
    keys[e.key] = true;

    // Jump
    if (e.key === 'w' && !player1.isJumping) {
        player1.velocityY = -12;
        player1.isJumping = true;
        setAnimation(player1, 'Jump');
    }

    if (e.key === 'ArrowUp' && !player2.isJumping) {
        player2.velocityY = -12;
        player2.isJumping = true;
        setAnimation(player2, 'Jump');
    }

    // Kick
    if (e.key === ' ') {
        setAnimation(player1, 'Kick');
        if (!player1.isKicking) {
            player1.isKicking = true;

            // Optional: play kick animation/sound here

            // Reset after short delay
            setTimeout(() => {
                player1.isKicking = false;
            }, 200); // Kick lasts 200ms
        }
    }

    if (e.key === 'Enter') {
        setAnimation(player2, 'Kick');
        if (!player2.isKicking) {
            player2.isKicking = true;

            // Optional: play kick animation/sound here

            // Reset after short delay
            setTimeout(() => {
                player2.isKicking = false;
            }, 200); // Kick lasts 200ms
        }
    }

});

window.addEventListener('keyup', e => {
    keys[e.key] = false;
});

function updatePlayer(player, leftKey, rightKey, isFlipped = false) {
    if (keys[leftKey]) {
        player.x -= 5;

        if (!player.isJumping) {
            setAnimation(player, isFlipped ? 'Move Forward' : 'Move Backward');
        }
    } else if (keys[rightKey]) {
        player.x += 5;

        if (!player.isJumping) {
            setAnimation(player, isFlipped ? 'Move Backward' : 'Move Forward');
        }
    } else if (!player.isJumping && !player.animation.startsWith('Kick')) {
        setAnimation(player, 'Idle');
    }

    // Gravity
    if (player.isJumping) {
        player.y += player.velocityY;
        player.velocityY += 0.5;

        if (player.velocityY > 0 && player.animation !== 'Falling Down') {
            setAnimation(player, 'Falling Down');
        }
    
        if (player.y >= player.groundY) {
            player.y = player.groundY;
            player.velocityY = 0;
            player.isJumping = false;
            setAnimation(player, 'Idle');
        }
    }
    
}


// game loop

function gameLoop(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updatePlayer(player1, 'a', 'd');
    updatePlayer(player2, 'ArrowLeft', 'ArrowRight', true);

    drawBackground();
    drawPlayer(player1, timestamp);
    drawPlayer(player2, timestamp);

    // Check collision and push only if touched
    if (checkBallCollision(player1, ball)) {
        bounceBallFromPlayer(player1);
    }

    if (checkBallCollision(player2, ball)) {
        bounceBallFromPlayer(player2);
    }

    drawBall();

    

    requestAnimationFrame(gameLoop);
}

function gameStart() {
    gameLoop();
}