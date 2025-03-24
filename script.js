const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1000;
canvas.height = 600;

const PLAYER_GRAVITY = 0.5;
const BALL_GRAVITY = 0.2;

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
        currentAnimation: characters["Character 02 - England"].idle, // Animation frames
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
            player.currentAnimation = (i === 1) ? characters[player.name].moveForward : characters[player.name].moveBackward;
        } else if (keys[player.controls.right]) {
            player.vx = player.speed;
            player.currentAnimation = (i === 1) ? characters[player.name].moveBackward : characters[player.name].moveForward;
        } else {
            player.vx = 0;
        }

        // Jumping
        if (keys[player.controls.jump] && !player.isJumping) {
            player.vy = player.jumpPower;
            player.isJumping = true;
            player.currentAnimation = characters[player.name].jump;
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
            ctx.drawImage(img, 0, 0, player.width, player.height); // Draw at new flipped origin
        } else { // Normal drawing for Player 1
            ctx.drawImage(img, player.x, player.y, player.width, player.height);
        }

        ctx.restore(); // Restore canvas state
    }
}





function drawBalls(index) {
    let ball = ballImages[index];
    if (!ball || !ball.complete) return;

    ctx.drawImage(ball, 470, 150, 65, 65);
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear frame
    
    drawBackground(1);
    updateMovement();
    drawCharacters(performance.now());
    drawBalls(1);

    requestAnimationFrame(animate); // Loop
}

animate();
