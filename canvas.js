const canvas = document.querySelector("#canvas-bg");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

class Ball {
    constructor(type, color, radius, position, velocity){
        this.type = type;
        this.color = color;
        this.radius = radius;
        this.position = position;
        this.velocity = velocity;
    }

    draw(){
        ctx.beginPath();
        if(this.type == 'stroke'){
            ctx.strokeStyle = this.color
            ctx.lineWidth = 2
        }
        else ctx.fillStyle = this.color;
        ctx.arc(this.position.x, this.position.y,this.radius, 0, Math.PI * 2, false);
        if(this.type == 'stroke') ctx.stroke();
        else ctx.fill();
        ctx.closePath();
    }

    update(){
        if(this.position.x >= canvas.width || this.position.x <= 0){
            this.velocity.x *= -1;
        }
        this.position.x += this.velocity.x;

        if(this.position.y >= canvas.height || this.position.y <= 0){
            this.velocity.y *= -1;
        }
        this.position.y += this.velocity.y;
        this.draw();
    }
}

let balls = [];

function getRandomNumberBetween(min, max){
    return ~~(Math.random() * (max - min) + min);
}

function addBall(){
    const type = getRandomNumberBetween(0, 2) == 0 ? 'stroke' : 'fill';
    const radius = getRandomNumberBetween(8, 18);
    const posX = getRandomNumberBetween(radius, canvas.width - radius);
    const posY = getRandomNumberBetween(radius, canvas.height - radius);
    let velX;
    do {
        velX = getRandomNumberBetween(-5, 5);
    }while(velX > -1 && velX < 1);
    let velY;
    do {
        velY = getRandomNumberBetween(-5, 5);
    }while(velY > -1 && velY < 1);

    const color = `hsla(${getRandomNumberBetween(60, 180)}, ${getRandomNumberBetween(50, 80)}%, ${getRandomNumberBetween(40, 60)}%, 1)`;
    // console.log(radius, posX, posY, velX, velY);

    const ball = new Ball(type, color, radius, {
        x: posX, 
        y: posY
    }, {
        x: velX,
        y: velY
    });
    balls.push(ball);
}



function animate(){
    requestAnimationFrame(animate);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    balls.forEach(ball => ball.update());
}

animate();