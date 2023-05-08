
//querySelectors
const gameBoard = document.querySelector('#board');
const scoreBoard = document.querySelector('#score');
const context = gameBoard.getContext('2d');
const resetBtn = document.querySelector('#reset');
const startGame = document.querySelector('#startGame');
const highestScore = document.querySelector('#highScore');
//Game board
const backgroundColor = 'lightgreen';
const unitSize = 15;
const width = gameBoard.width;
const height = gameBoard.height;


let state = false;
let score = 0;
let highestScoreValue = localStorage.getItem('highestScore') || 0;


startGame.addEventListener('click',start);
//game start func
function start() {
  state = true;
  scoreBoard.textContent = `current score: ${score}`;
  food();
  drawFood();
  tick();
  poison();
  drawPoison();
  badFood();
  drawBadfood();
  snakeEats();
}


const snakeColor = 'orange';
const snakeBorder = 'black';
let snake = [
  {x: unitSize * 3, y:0},
  {x: unitSize * 2, y:0},
  {x: unitSize * 1, y:0},
  {x: unitSize, y:0},
  {x:0, y:0}
];

  function drawSnake(){
    context.fillStyle = snakeColor;
    context.strokeStyle = snakeBorder;
  
  for (let i = 0; i < snake.length; i++) {
    const snakePart = snake[i];
    context.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
    context.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
  }
  }
  document.addEventListener('keydown', changeDir);

  let xVelocity = unitSize;
  let yVelocity = 0;
  let speed = 200;
  const speedIncrease = 5;
  const speedDecrease = 3;
  // moves the snake 

  function snakeEats(){
    const front = {x: snake[0].x + xVelocity, 
        y: snake[0].y + yVelocity};
        snake.unshift(front);
        
    // if food is eaten add 1 to score and spawn new food
    if(snake[0].x === foodX && snake[0].y === foodY){
        score += 1;
        scoreBoard.textContent = `current score: ${score}`;
        food();
        speed -= speedIncrease;

    } else if(snake[0].x === poisonX && snake[0].y === poisonY){
        score -= 3;
        scoreBoard.textContent = `current score: ${score}`;
        poison();
        speed += speedDecrease;

    } else if(snake[0].x === badFoodX && snake[0].y === badFoodY){
      gameOver();
    }
    else{
        snake.pop();
    }
  }

  function changeDir(event){
    const key = event.keyCode;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    const LeftKey = (xVelocity === -unitSize);
    const upKey = (yVelocity === -unitSize);
    const RightKey = (xVelocity === unitSize);
    const DownKey =(yVelocity === unitSize);

    if (key === LEFT && xVelocity !== unitSize) {
        xVelocity = -unitSize;
        yVelocity = 0;
      } else if (key === UP && yVelocity !== unitSize) {
        xVelocity = 0;
        yVelocity = -unitSize;
      } else if (key === RIGHT && xVelocity !== -unitSize) {
        xVelocity = unitSize;
        yVelocity = 0;
      } else if (key === DOWN && yVelocity !== -unitSize) {
        xVelocity = 0;
        yVelocity = unitSize;
      }
    };

  const foodColor = 'red';
  let foodX;
  let foodY;

  // food randomizer
  function food(){
    function randomF(min, max){
        const random = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        return random;
    }
    foodX = randomF(0, width - unitSize);
    foodY = randomF(0, width - unitSize);
};

// Draws food on the board 
function drawFood(){
    context.fillStyle = foodColor;
    context.fillRect(foodX, foodY, unitSize, unitSize);

};
const poisonColor = 'purple';
let poisonX;
let poisonY;

function poison(){
  function randomPoison(min, max){
    const randomP = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
    return randomP;
  }
  poisonX = randomPoison(0, height - unitSize);
  poisonY = randomPoison(0, height - unitSize);

};

function drawPoison(){
  context.fillStyle = poisonColor;
  context.fillRect(poisonX, poisonY, unitSize, unitSize);

};

const badFoodColor = 'black';
let badFoodX;
let badFoodY;

function badFood(){
  function randomBad(min, max){
    const randomB = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
    return randomB;
  }
  badFoodX = randomBad(0, height - unitSize);
  badFoodY = randomBad(0, height - unitSize);

};

function drawBadfood(){
  context.fillStyle = badFoodColor;
  context.fillRect(badFoodX, badFoodY, unitSize, unitSize);

};

//ends the game and displays game over
function gameOver(){
    state = false;
    displayGameOver();

}

//game over text
function displayGameOver(){
    context.fillStyle = 'black';
    context.font = '40px lucida sans';
    context.fillText('GAME OVER!', width / 2 - 100, height / 2);
    if (score > highestScoreValue) {
      highestScoreValue = score;
      localStorage.setItem('highestScore', highestScoreValue);
    }
    highestScore.textContent = `High Score: ${highestScoreValue}`;
}

//if snake hits the walls = game over or if the sake eats itself = game over
function CheckgameOver(){
    switch (true) {
        case snake[0].x < 0:
        case snake[0].x >= width:
        case snake[0].y < 0:
        case snake[0].y >= height:
          gameOver();
          break;
      }
      for (let i = 1; i < snake.length; i += 1) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
          gameOver();
          break;
        }
      }
}

function tick(){
  if(state){ 
      setTimeout(() =>{
          clear();
          drawFood();
          drawPoison();
          snakeEats();
          drawBadfood();
          drawSnake();
          CheckgameOver();
          tick();
      }, speed);
  } 
};

  //clears the board
  function clear(){
      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, width, height);
  }

resetBtn.addEventListener('click', reset);
//restarts the game
function reset(){
    score = 0;
    speed = 200;
    xVelocity = unitSize;
    yVelocity = 0;
    snake = [
        {x: unitSize * 3, y:0},
        {x: unitSize * 2, y:0},
        {x: unitSize * 1, y:0},
        {x: unitSize, y:0},
        {x:0, y:0}
    ];
    start();

}

startGame.addEventListener('click',start);
