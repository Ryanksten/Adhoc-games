console.log("Script loaded");

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let bird = {
    x: canvas.width / 2 - 10,
    y: canvas.height / 2 - 10,
    width: 20,
    height: 20,
    yMotion: 0
};

let columns = [];
let score = 0;
let gameOver = false;
let started = false;
let space = 300;
let columnWidth = 100;
let columnGap = 200;
let gravity = 0.5;
let jumpStrength = 8;
let columnSpeed = 3;

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        console.log("Space key pressed");
        jump();
    }
});

function addColumn() {
    console.log("Adding column");
    let minHeight = 50;
    let maxHeight = canvas.height - space - 120 - minHeight;
    let height = minHeight + Math.random() * (maxHeight - minHeight);
    
    columns.push({
        x: canvas.width,
        y: canvas.height - height - 120,
        width: columnWidth,
        height: height
    });
    columns.push({
        x: canvas.width,
        y: 0,
        width: columnWidth,
        height: canvas.height - height - space - 120
    });
}

function jump() {
    console.log("Jumping");
    if (gameOver) {
        bird = {
            x: canvas.width / 2 - 10,
            y: canvas.height / 2 - 10,
            width: 20,
            height: 20,
            yMotion: 0
        };
        columns = [];
        score = 0;
        gameOver = false;
        started = false;
        addColumn();
        addColumn();
        addColumn();
        addColumn();
    }

    if (!started) {
        started = true;
    }

    if (bird.yMotion > 0) {
        bird.yMotion = 0;
    }

    bird.yMotion -= jumpStrength;
}

function update() {
    if (started) {
        bird.yMotion += gravity;
        bird.y += bird.yMotion;

        columns.forEach((column, index) => {
            column.x -= columnSpeed;
            if (column.x + column.width < 0) {
                columns.splice(index, 1);
                if (index % 2 === 0) {
                    addColumn();
                }
            }

            if (column.x < bird.x + bird.width && column.x + column.width > bird.x && 
                column.y < bird.y + bird.height && column.y + column.height > bird.y) {
                gameOver = true;
            }
        });

        if (bird.y > canvas.height - 120 || bird.y < 0) {
            gameOver = true;
        }

        if (!gameOver) {
            score++;
        }
    }
}

function draw() {
    ctx.fillStyle = 'cyan';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'orange';
    ctx.fillRect(0, canvas.height - 120, canvas.width, 120);

    ctx.fillStyle = 'green';
    ctx.fillRect(0, canvas.height - 120, canvas.width, 20);

    ctx.fillStyle = 'red';
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

    columns.forEach((column) => {
        ctx.fillStyle = 'green';
        ctx.fillRect(column.x, column.y, column.width, column.height);
    });

    ctx.fillStyle = 'white';
    ctx.font = '100px Arial';

    if (!started) {
        ctx.fillText('Press SPACE to Start', 75, canvas.height / 2 - 50);
    }

    if (gameOver) {
        ctx.fillText('Game Over', 100, canvas.height / 2 - 50);
    }

    if (!gameOver && started) {
        ctx.fillText(score, canvas.width / 2 - 25, 100);
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

console.log("Initializing game");
addColumn();
addColumn();
addColumn();
addColumn();
gameLoop();
console.log("Game loop started");
