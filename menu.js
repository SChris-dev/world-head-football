// containers
const menuContainer = document.getElementById('menuContainer');
const instructionMenu = document.getElementById('instructionMenu');
const gameContainer = document.getElementById('gameContainer');

// elements
const usernameInput = document.getElementById('usernameInput');
const selectLevel = document.getElementById('selectLevel');
const selectBall1 = document.getElementById('selectBall1');
const selectBall2 = document.getElementById('selectBall2');
const selectPlayer1 = document.getElementById('selectPlayer1');
const selectPlayer2 = document.getElementById('selectPlayer2');
const startBtn = document.getElementById('startBtn');
const instructionBtn = document.getElementById('instructionBtn');
const closeInstructionBtn = document.getElementById('closeInstructionBtn');

// event listeners
function validateInput() {
    let username = usernameInput.value;

    startBtn.disabled = username.trim() === '';
}

instructionBtn.addEventListener('click', () => {
    instructionMenu.style.display = 'flex';
})

closeInstructionBtn.addEventListener('click', () => {
    instructionMenu.style.display = 'none';
})

usernameInput.addEventListener('input', validateInput);

selectPlayer1.addEventListener('change', (e) => {
    const index = parseInt(e.target.value) - 1;
    if (index >= 0) {
        player1.character = characterNames[index];
        setAnimation(player1, 'Idle');
    }
});

selectPlayer2.addEventListener('change', (e) => {
    const index = parseInt(e.target.value) - 1;
    if (index >= 0) {
        player2.character = characterNames[index];
        setAnimation(player2, 'Idle');
    }
});

selectBall1.addEventListener('change', () => {
    selectedBallImage = ballImages.ball1;
    ball.image = selectedBallImage;
})
selectBall2.addEventListener('change', () => {
    selectedBallImage = ballImages.ball2;
    ball.image = selectedBallImage;
})

// validateInput();

startBtn.addEventListener('click', () => {
    menuContainer.style.display = 'none';
    gameContainer.style.display = 'flex';
    gameStart();
})