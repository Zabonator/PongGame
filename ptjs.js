/*
By CodeExplained
modified by Owen Szabo
*/

const cvs = document.getElementById("pong");
const ctx = cvs.getContext("2d");

//create rectangle
function drawRect(x,y,w,h,color) {
    ctx.fillStyle = color;
    ctx.fillRect(x,y,w,h);
}//end drawRect

drawRect(0,0,cvs.width,cvs.height, "BLACK");

//create circle
function drawCircle(x,y,r,color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,false);
    ctx.closePath();
    ctx.fill();
}//end drawCircle

//create text
function drawText(text,x,y,color) {
    ctx.fillStyle = color;
    ctx.font = "45px fantasy";
    ctx.fillText(text,x,y);
}//end drawText

const user = {
    x : 0,
    y : cvs.height/2 - 100/2,
    width : 10,
    height : 100,
    color : "GREENYELLOW",
    score : 0
}

const com = {
    x : cvs.width - 10,
    y : cvs.height/2 - 100/2,
    width : 10,
    height : 100,
    color : "GREENYELLOW",
    score : 0
}

const net = {
    x : cvs.width/2 - 2/2,
    y : 0,
    width : 2,
    height : 10,
    color : "GREENYELLOW",
}

function drawNet(){
    for(var i = 0; i <= cvs.height; i += 15) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }//end i loop
}//end drawNet

const ball = {
    x : cvs.width/2,
    y : cvs.height/2,
    radius : 10,
    speed : 5,
    velocityX : 5,
    velocityY : 5,
    color : "GREENYELLOW"
}

function render() {
    //clear canvas
    drawRect(0, 0, cvs.width, cvs.height, "BLACK");
    
    //draw net
    drawNet();
    
    //draw score
    drawText(user.score,cvs.width/4,cvs.height/5,"GREENYELLOW");
    drawText(com.score,3*cvs.width/4,cvs.height/5,"GREENYELLOW");
    
    //draw user and com paddle
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);
    
    //draw the ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}//end render

//controll paddle

cvs.addEventListener("mousemove", movePaddle);

function movePaddle(evt) {
    let rect = cvs.getBoundingClientRect();
    
    user.y = evt.clientY - rect.top - user.height/2;
}

function collision(b,p) {
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    
    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}//end collision

//reset ball
function resetBall() {
    ball.x = cvs.width/2;
    ball.y = cvs.height/2;
    
    ball.speed = 5;
    ball.velocityX = -(ball.velocityX/ball.velocityX) * 5;
}

function update() {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    
    //simple AI
    let computerLevel = 0.05;
    com.y += (ball.y - (com.y + com.height/2)) * computerLevel;
    
    if(ball.y + ball.radius > cvs.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }//end if
    
    let player = (ball.x < cvs.width/2) ? user : com;
    
    if(collision(ball,player)) {
        //where ballhit player
        let collidePoint = ball.y - (player.y + player.height/2);
        //normalization
        collidePoint = collidePoint/(player.height/2);
        //calculate angle
        let angleRad = collidePoint * Math.PI/4;
        
        let direction = (ball.x < cvs.width/2) ? 1 : -1;
        
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        
        ball.speed += 1.0;
    }//end if
    
    //update score
    if (ball.x - ball.radius < 0) {
        //com win
        com.score++;
        resetBall();
    } else if (ball.x + ball.radius > cvs.width){
        //user win
        user.score++;
        resetBall();
    }//end else if
}//end update

function end() {
    if (com.score >= 10) {
        clearInterval(play);
        drawText("Computer Wins!",cvs.width/2,cvs.height/2,"GREENYELLOW");
    } else if (user.score >= 10) {
        clearInterval(play);
        drawText("User Wins!",50,cvs.height/2,"GREENYELLOW");
    }//end else if
}//end end

//game init 
function game() {
    update();
    render();
    end();
}//end game

var play;
function beginGame() {
    com.score = 0;
    user.score = 0;
    resetBall();
    render();
    const framePerSecond = 50;
    play = setInterval(game,1000/framePerSecond);
}//end beginGame

