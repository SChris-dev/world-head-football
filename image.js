const imageCache = {}; // Store loaded images

function loadImage(src) {
    if (imageCache[src]) return imageCache[src]; // Return cached image

    const img = new Image();
    img.src = src;
    imageCache[src] = img;
    return img;
}

const backgroundImages = [];

function loadBackgrounds(bgName, count) {
    for (let i = 0; i < count; i++) {
        let path = `./Sprites/${bgName}${i + 1}.jpg`;
        let img = new Image();
        img.src = path;
        backgroundImages.push(img);
    }
}

loadBackgrounds('background', 2);

const ballImages = [];

function loadBalls(ballName, count) {
    for (let i = 0; i < count; i++) {
        let path = `./Sprites/${ballName} 0${i + 1}.png`;

        let encodedPath = encodeURI(path);

        let img = new Image();
        img.src = encodedPath;
        ballImages.push(img);
    }
}

loadBalls('Ball', 2);

// Properly handles spaces in folder and filenames
function generateFrames(characterName, folder, count) {
    let frames = [];
    for (let i = 0; i < count; i++) {
        let frameNumber = String(i).padStart(3, '0'); // Format: 000, 001...
        let path = `./Sprites/Characters/${characterName}/${folder}/${folder}_${frameNumber}.png`;
        
        // Fix spaces in paths
        let encodedPath = encodeURI(path); 

        frames.push(loadImage(encodedPath));
    }
    return frames;
}


// Example: Preload animations for "Character 01 - Brazil"
const characters = {
    "Character 01 - Brazil": {
        idle: generateFrames("Character 01 - Brazil", "Idle", 18),
        moveForward: generateFrames("Character 01 - Brazil", "Move Forward", 10),
        moveBackward: generateFrames("Character 01 - Brazil", "Move Backward", 10),
        jump: generateFrames("Character 01 - Brazil", "Jump", 5),
        fall: generateFrames("Character 01 - Brazil", "Falling Down", 5),
        kick: generateFrames("Character 01 - Brazil", "Kick", 9)
    },
    "Character 02 - England": {
        idle: generateFrames("Character 02 - England", "Idle", 18),
        moveForward: generateFrames("Character 02 - England", "Move Forward", 10),
        moveBackward: generateFrames("Character 02 - England", "Move Backward", 10),
        jump: generateFrames("Character 02 - England", "Jump", 5),
        fall: generateFrames("Character 02 - England", "Falling Down", 5),
        kick: generateFrames("Character 02 - England", "Kick", 9)
    }
};

console.log("Images loaded:", characters);
