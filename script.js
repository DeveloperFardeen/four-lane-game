const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set car dimensions and lanes
const laneWidth = canvas.width / 4;
const carWidth = 40;
const carHeight = 80;
let isGameOver = false;

const playerCar = {
    x: laneWidth * 1.5 - carWidth / 2, // Start in the second lane
    y: canvas.height - carHeight - 10,
    speed: 5,
};

const otherCars = [];
let score = 0;
let speedMultiplier = 1;

// Load the car images
const playerCarImg = new Image();
playerCarImg.src = 'my_car.png';

const enemyCarImg = new Image();
enemyCarImg.src = 'enemy_car.png';

// Create random enemy cars
function generateEnemyCar() {
    const lane = Math.floor(Math.random() * 4);
    const x = lane * laneWidth + laneWidth / 2 - carWidth / 2;
    const y = -carHeight;
    const speed = Math.random() * 3 + 2;
    otherCars.push({ x, y, speed });
}

// Move enemy cars down the road
function moveEnemyCars() {
    otherCars.forEach((car, index) => {
        car.y += car.speed * speedMultiplier;

        // Check if enemy car goes off-screen
        if (car.y > canvas.height) {
            otherCars.splice(index, 1);
            score++;
            speedMultiplier += 0.01; // Increase speed as you score more
        }

        // Check collision
        if (car.y + carHeight > playerCar.y && car.y < playerCar.y + carHeight &&
            car.x < playerCar.x + carWidth && car.x + carWidth > playerCar.x) {
            isGameOver = true;
        }
    });
}

// Draw player car
function drawPlayerCar() {
    ctx.drawImage(playerCarImg, playerCar.x, playerCar.y, carWidth, carHeight);
}

// Draw enemy cars
function drawEnemyCars() {
    otherCars.forEach(car => {
        ctx.drawImage(enemyCarImg, car.x, car.y, carWidth, carHeight);
    });
}

// Handle movement
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && playerCar.x > 0) {
        playerCar.x -= laneWidth;
    }
    if (e.key === 'ArrowRight' && playerCar.x < canvas.width - carWidth) {
        playerCar.x += laneWidth;
    }
    if (e.key === 'ArrowUp') {
        playerCar.y -= laneWidth; // Move forward
    }
    if (e.key === 'ArrowDown' && playerCar.y < originalPositionY) {
        playerCar.y += laneWidth; // Move backward till original position
    }
});


// Game loop
function gameLoop() {
    if (isGameOver) {
        ctx.fillStyle = 'red';
        ctx.font = '40px Arial';
        ctx.fillText('Game Over', canvas.width / 4, canvas.height / 2);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayerCar();
    drawEnemyCars();
    moveEnemyCars();

    // Generate enemy cars periodically
    if (Math.random() < 0.02) {
        generateEnemyCar();
    }

    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);

    requestAnimationFrame(gameLoop);
}

// Start the game
playerCarImg.onload = () => {
    enemyCarImg.onload = () => {
        gameLoop();
    };
};

// Add the restart button event listener
document.getElementById('restartButton').addEventListener('click', restartGame);

function restartGame() {
    // Reset game variables
    isGameOver = false;
    otherCars.length = 0; // Clear the enemy cars array
    score = 0; // Reset score
    speedMultiplier = 1; // Reset speed
    playerCar.x = laneWidth * 1.5 - carWidth / 2; // Reset player position
    playerCar.y = canvas.height - carHeight - 10; // Reset player Y position

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Restart the game loop
    gameLoop();
}
