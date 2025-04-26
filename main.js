
//Initialize the canvas
let board
let boardHeight = 720;
let boardWidth = 1080;
const gravity = 9.8066;
const deltaTime = 1/60; //60 FPS
const force = 15;
let isDrag = false;

let ball = {
    x : boardWidth/2,
    y : boardHeight/2,
    velocityX : 0,
    velocityY : 0,
    forceX : 0,
    forceY: 0,
    mass: 15,
    accelerationX : 1,
    accelerationY : 1,
    radius : 25,
    startAngle : 0,
    endAngle : 2 * Math.PI
}

window.onload = function() {
    board = document.getElementById("board"); //Link the HTML canvas to the JS canvas
    board.height = boardHeight;
    board.width = boardWidth;
    ctx = board.getContext("2d") //Set the board to 2D
    
    drawCircle(ctx, ball.x, ball.y, ball.radius);
    requestAnimationFrame(update)
    document.addEventListener("keydown", (e) => moveBall(e, force)); //Move the ball when a key is pressed
   
}
function update(){
    requestAnimationFrame(update)
    ctx.clearRect(0,0,boardWidth, boardHeight)
    // toggleGravity();
    dragForce(isDrag);
    //Update Position
    ball.yNext = ball.y + ball.velocityY
    ball.xNext = ball.x + ball.velocityX
    //If ball is colliding with border, make ball bounce
    if (borderDetectionY(ball.yNext, ball.radius)!=true){
        ball.y = ball.yNext;
    } else {
        ballBounce(true, false, ball);
    }
    if (borderDetectionX(ball.xNext, ball.radius)!=true){
        ball.x = ball.xNext;
    } else {
        ballBounce(false, true, ball);
    }
    drawCircle(ctx, ball.x, ball.y, ball.radius);
}
function moveBall(e, force){
    document.addEventListener("keyup", keyRelease);
    if (e.code == "KeyW"){
        ball.forceY -= force;
        ball.accelerationY = ball.forceY / ball.mass;
        ball.velocityY += ball.accelerationY * deltaTime;
    }if (e.code == "KeyS"){
        ball.forceY -= force;
        ball.accelerationY = ball.forceY / ball.mass;
        ball.velocityY += ball.accelerationY * deltaTime *-1;
        
    }if (e.code == "KeyD"){
        ball.forceX -= force;
        ball.accelerationX = ball.forceX / ball.mass;
        ball.velocityX += ball.accelerationX * deltaTime *-1;
    } if (e.code == "KeyA"){
        ball.forceX -= force;
        ball.accelerationX = ball.forceX / ball.mass;
        ball.velocityX += ball.accelerationX * deltaTime ;
    } 
}
function keyRelease(e){
     if (e.code == "KeyW" || e.code == "KeyS"){
        ball.forceY = 0;
        ball.accelerationY = 0;
     }
     if (e.code == "KeyD" || e.code == "KeyA"){
        ball.forceX = 0;
        ball.accelerationX = 0;
     }
     isDrag = true;
}
function drawCircle(context, x, y, radius) {
	context.save();
	context.beginPath();
	context.arc(x, y, radius, ball.startAngle, ball.endAngle, true);
    context.fillStyle = 'white';
    context.fill();

}
function toggleGravity(){
    ball.velocityY += gravity * deltaTime; 
}
function dragForce(isDrag){
    if (isDrag == true){
        const friction = 0.98;
        ball.velocityX *= friction;
        ball.velocityY *= friction;
    }
    if (Math.abs(ball.velocityY) < 0.01) ball.velocityY = 0;
    if (Math.abs(ball.velocityX) < 0.01) ball.velocityX = 0;
}
function ballBounce(borderDetectY, borderDetectX, ball){
    //Ball Bounce Formula
    const energyRetainedX = Math.max(0.5, Math.min(1, Math.abs(ball.velocityX) / 20));
    const energyRetainedY = Math.max(0.5, Math.min(1, Math.abs(ball.velocityY) / 20));
    if (borderDetectY){
        ball.velocityY *= -energyRetainedX;
    } else if (borderDetectX){
        ball.velocityX *= -energyRetainedY;
    }
}
function borderDetectionY(yPosition, radius){
    //Detect if ball is currently colliding with the top/bottom border
    return (yPosition + radius > boardHeight || yPosition - radius < 0)
}
function borderDetectionX(xPosition, radius){
    //Detect if ball is currently colliding with the side border
    return (xPosition + radius*0.80 > boardWidth || xPosition - radius < 0)
}