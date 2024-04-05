let engine = Matter.Engine.create({
    gravity: { x: 0, y: 0.5 }
});

let renderer = Matter.Render.create({
    element: document.body,
    engine: engine,
    options: {
        height: 800,
        width: 1500,
        wireframes: false,
        background: './assets/BasketBallBG4.png', 
    }
    
});

let ground = Matter.Bodies.rectangle(1000, 900, 1600, 200, {
    isStatic: true,
    render: {
        visible: false 
    }
});

let basketballRing = Matter.Bodies.rectangle(1435, 300, 80, 20, {
    isStatic: true,
    render: {
        fillStyle: 'transparent',
        strokeStyle: 'transparent',
        lineWidth: 5
    }
});

let Obj = Matter.Bodies.rectangle(1485, 270, 30, 20, {
    isStatic: true,
    render: {
        fillStyle: 'transparent',
        strokeStyle: '',
        lineWidth: 5
    }
});

let Obj2 = Matter.Bodies.rectangle(1390, 270, 10, 20, {
    isStatic: true,
    render: {
        fillStyle: 'transparent',
        strokeStyle: '',
        lineWidth: 5
    }
});

let Stick1 = Matter.Bodies.rectangle(1450, 0, 3000, 20, {
    isStatic: true,
    render: {
        fillStyle: 'black',
        strokeStyle: 'black',
        lineWidth: 5
    }
});

let Stick2 = Matter.Bodies.rectangle(500, 800, 3000, 20, {
    isStatic: true,
    render: {
        fillStyle: 'black',
        strokeStyle: 'black',
        lineWidth: 5
    }
});

let Stick3 = Matter.Bodies.rectangle(0, 500, 30, 1000, {
    isStatic: true,
    render: {
        fillStyle: 'black',
        strokeStyle: 'black',
        lineWidth: 5
    }
});

let Stick4 = Matter.Bodies.rectangle(1500, 500, 30, 1000, {
    isStatic: true,
    render: {
        fillStyle: 'black',
        strokeStyle: 'black',
        lineWidth: 5
    }
});

let ball = Matter.Bodies.circle(200, 500, 20, {
    render: {
        sprite: {
            texture: './assets/basketball101.png'
        }
    }
});

let Ring = Matter.Bodies.circle(1450, 300, 20, {
    isStatic : true,
    render: {
        sprite: {
            texture: './assets/BRing4.png'
        
        }
    }
});

let sling = Matter.Constraint.create({
    pointA: { x: 200, y: 500 },
    bodyB: ball,
    stiffness: 0.05
});

let mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: Matter.Mouse.create(renderer.canvas)
});
renderer.mouse = mouseConstraint;

let score = 0;
let scoreDisplay = document.createElement('div');
scoreDisplay.style.position = 'absolute';
scoreDisplay.style.top = '20px';
scoreDisplay.style.left = '20px';
scoreDisplay.style.color = 'white';
scoreDisplay.style.fontFamily = 'Arial';
scoreDisplay.style.fontSize = '24px';
scoreDisplay.innerHTML = 'Score: ' + score;
document.body.appendChild(scoreDisplay);

let timeLeft = 45; 
let timerDisplay = document.createElement('div');
timerDisplay.style.position = 'absolute';
timerDisplay.style.top = '20px';
timerDisplay.style.right = '20px';
timerDisplay.style.color = 'white';
timerDisplay.style.fontFamily = 'Arial';
timerDisplay.style.fontSize = '24px';
timerDisplay.innerHTML = 'Time: ' + timeLeft + 's';
document.body.appendChild(timerDisplay);

function respawnBall() {
    Matter.Body.setPosition(ball, { x: 200, y: 500 });
    Matter.Body.setVelocity(ball, { x: 0, y: 0 }); 
    Matter.Body.setAngularVelocity(ball, 0);
    Matter.Body.setStatic(ball, true);
}

Matter.Events.on(mouseConstraint, 'startdrag', function(event) {
    if (event.body === ball) {
        mouseStartPosition = event.mouse.position;
        ballStartPosition = ball.position;
        Matter.Body.setStatic(ball, false); // Allow the ball to be affected by gravity
    }
});

Matter.Events.on(mouseConstraint, 'enddrag', function(event) {
    if (event.body === ball) {
        let mouseEndPosition = event.mouse.position;
        let dragVector = Matter.Vector.sub(mouseEndPosition, mouseStartPosition);
        let impulseMagnitude = Matter.Vector.magnitude(dragVector) * 0.01; // Adjust the impulse magnitude multiplier as needed
        let impulse = Matter.Vector.normalise(dragVector);
        impulse = Matter.Vector.mult(impulse, impulseMagnitude);
        Matter.Body.applyForce(ball, ballStartPosition, impulse);

        sling.pointA = { x: 0, y: 0 };
        sling.bodyB = null;

        setTimeout(respawnBall, 3000); 
    }
});

Matter.Events.on(engine, 'collisionStart', function(event) {
    let pairs = event.pairs;
    pairs.forEach(pair => {
        if ((pair.bodyA === ball && pair.bodyB === basketballRing) ||
            (pair.bodyA === basketballRing && pair.bodyB === ball)) {
            score++;
            scoreDisplay.innerHTML = 'Score: ' + score;
        }
    });
});

let timerInterval = setInterval(function() {
    timeLeft--;
    timerDisplay.innerHTML = 'Time: ' + timeLeft + 's';
    if (timeLeft === 0) {
        clearInterval(timerInterval);
        alert("Time's up!");
    }
}, 1000);

Matter.World.add(engine.world, [ground, basketballRing, ball, sling, mouseConstraint, Stick1, Stick2, Stick3, Stick4, Ring, Obj, Obj2]);

Matter.Render.run(renderer);
Matter.Runner.run(engine);
