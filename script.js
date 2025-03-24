const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1000;
canvas.height = 600;

const PLAYER_GRAVITY = 0.5;
const BALL_GRAVITY = 0.4;
const BALL_BOUNCE = -9; // Bounce height

let frameIndex = 0;
let selectedCharacter = "Character 01 - Brazil"; // Default character
let currentAnimation = characters[selectedCharacter].idle;

function drawBackground(index) {
    let bg = backgroundImages[index];
    if (!bg || !bg.complete) return;

    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
}

const players = [
    {
        x: 100,
        y: 360,
        width: 160,
        height: 160,
        vx: 0,
        vy: 0,
        speed: 5,
        jumpPower: -15,
        isJumping: false, // Track if in air
        controls: { left: 'a', right: 'd', jump: 'w' }, // Player 2 uses A & D
        currentAnimation: characters["Character 01 - Brazil"].idle, // Animation frames
        frameIndex: 0,
        lastFrameTime: 0,
        name: 'Character 01 - Brazil'
    },
    {
        x: 300,
        y: 360,
        width: 160,
        height: 160,
        vx: 0,
        speed: 5,
        jumpPower: -15,
        isJumping: false, // Track if in air
        controls: { left: 'ArrowLeft', right: 'ArrowRight', jump: 'ArrowUp' },
        currentAnimation: [], // Animation frames
        frameIndex: 0,
        lastFrameTime: 0,
        name: 'Character 02 - England'
    }
];

const keys = {};

// Handle key presses
window.addEventListener('keydown', (event) => {
    keys[event.key] = true;
});

window.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

// Update movement for all players
function updateMovement() {
    for (let i = 0; i < players.length; i++) {
        let player = players[i];

        // Horizontal Movement
        if (keys[player.controls.left]) {
            player.vx = -player.speed;
            if (!player.isJumping) {
                player.currentAnimation = (i === 1) ? characters[player.name].moveForward : characters[player.name].moveBackward;
            }
        } else if (keys[player.controls.right]) {
            player.vx = player.speed;
            if (!player.isJumping) {
                player.currentAnimation = (i === 1) ? characters[player.name].moveBackward : characters[player.name].moveForward;
            }
        } else {
            player.vx = 0;
        }

        // Jumping
        if (keys[player.controls.jump] && !player.isJumping) {
            player.vy = player.jumpPower;
            player.isJumping = true;
            player.currentAnimation = characters[player.name].jump;
        }

        if (player.y < player.vy + player.jumpPower + 160) {
            player.currentAnimation = characters[player.name].fall;
        }

        // Apply PLAYER_GRAVITY
        player.vy += PLAYER_GRAVITY;
        player.y += player.vy;

        // Ground Collision
        if (player.y >= 360) {
            player.y = 360;
            player.vy = 0;
            player.isJumping = false;
            if (player.vx === 0) {
                player.currentAnimation = characters[player.name].idle;
            }
        }

        // Apply movement
        player.x += player.vx;
    }
}

const ball_obj = {
    x: (canvas.width / 2) - 35,
    y: 100,
    radius: 10,
    width: 65,
    height: 65,
    vx: 0, // Ball's horizontal velocity
    vy: 0, // Ball's vertical velocity
    
}

function updateBall() {
    // Apply gravity
    ball_obj.vy += BALL_GRAVITY;

    // Update position
    ball_obj.x += ball_obj.vx;
    ball_obj.y += ball_obj.vy;

    // Floor Collision (Bounce properly)
    if (ball_obj.y + ball_obj.radius >= 440) {
        ball_obj.y = 440 - ball_obj.radius;
        ball_obj.vy *= -0.85; // Retain energy for realistic bouncing

        if (Math.abs(ball_obj.vy) < 2) {
            ball_obj.vy = 0; // Stop unnecessary bouncing
        }

        // Apply ground friction
        ball_obj.vx *= 0.9;
    }

    // Wall Collision (Left & Right)
    if (ball_obj.x - ball_obj.radius <= 0 || ball_obj.x + ball_obj.radius >= canvas.width) {
        ball_obj.vx *= -1; // Reverse direction
    }

    // **Player Collision**
    for (let player of players) {
        let isColliding =
            ball_obj.x + ball_obj.radius > player.x &&
            ball_obj.x - ball_obj.radius < player.x + player.width &&
            ball_obj.y + ball_obj.radius > player.y &&
            ball_obj.y - ball_obj.radius < player.y + player.height;

        if (isColliding) {
            let isAbove =
                player.y + player.height >= ball_obj.y - ball_obj.radius &&
                player.y + player.height <= ball_obj.y - ball_obj.radius + 10; // Small margin for standing detection

            if (isAbove) {
                ball_obj.vy = -9; // Stronger bounce when player lands on it
            } else {
                let impactAngle = (ball_obj.x - (player.x + player.width / 2)) / (player.width / 2);
                ball_obj.vx = impactAngle * 5; // Rebound horizontally
                ball_obj.vy = -Math.abs(ball_obj.vy) * 1.05; // Increase bounce height slightly
            }
        }
    }
}









const frameInterval = 50;
let lastFrameTime = 0;

function drawCharacters(timestamp) {
    for (let i = 0; i < players.length; i++) {
        let player = players[i];

        if (!player.currentAnimation.length) continue; // Skip if no animation

        let img = player.currentAnimation[player.frameIndex % player.currentAnimation.length];
        if (!img.complete) continue; // Ensure image is loaded

        // Control animation speed
        if (timestamp - player.lastFrameTime >= frameInterval) {
            player.frameIndex = (player.frameIndex + 1) % player.currentAnimation.length;
            player.lastFrameTime = timestamp;
        }

        ctx.save(); // Save canvas state

        if (i === 1) { // Player 2 needs to be flipped
            ctx.translate(player.x + player.width, player.y); // Move origin to Player 2's right edge
            ctx.scale(-1, 1); // Flip horizontally
            ctx.drawImage(img, -900, 360, player.width, player.height); // Draw at new flipped origin
        } else { // Normal drawing for Player 1
            ctx.drawImage(img, player.x, player.y, player.width, player.height);
        }

        ctx.restore(); // Restore canvas state
    }
}





function drawBalls(index) {
    let ballImg = ballImages[index];
    if (!ballImg || !ballImg.complete) return;

    ctx.drawImage(ballImg, ball_obj.x, ball_obj.y, 65, 65);
}


function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear frame
    
    drawBackground(1);
    updateMovement();
    updateBall();
    drawCharacters(performance.now());
    drawBalls(1);

    requestAnimationFrame(animate); // Loop
}

animate();
