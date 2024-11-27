<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Particle System</title>
    <style>
        body {
            margin: 0;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background-color: #000; /* Optional: Set a background color */
        }
        canvas {
            display: block;
            border: 1px solid white; /* Optional: Add a border to the canvas */
        }
        button {
            margin: 20px;
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <button id="startButton">Start Animation</button>
    <canvas id="particleCanvas"></canvas>
    <script src="particle.js"></script>
</body>
</html>


document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    const startButton = document.getElementById('startButton');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 5 + 1; // Random size
            this.speedX = (Math.random() - 0.5) * 2; // Random speed in x direction
            this.speedY = (Math.random() - 0.5) * 2; // Random speed in y direction
            this.color = 'rgba(255, 255, 255, 0.8)'; // White color with some transparency
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    let particles = [];
    let animationId; // Variable to hold the animation frame ID

    function createParticles(e) {
        const xPos = e.x;
        const yPos = e.y;
        const numberOfParticles = 10; // Number of particles to create on click

        for (let i = 0; i < numberOfParticles; i++) {
            particles.push(new Particle(xPos, yPos));
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

        particles.forEach((particle, index) => {
            particle.update();
            particle.draw();

            // Remove particles that are out of bounds
            if (particle.x < 0 || particle.x > canvas.width || particle.y < 0 || particle.y > canvas.height) {
                particles.splice(index, 1);
            }
        });

        animationId = requestAnimationFrame(animate); // Call animate again for the next frame
    }

    startButton.addEventListener('click', () => {
        // Start the animation
        particles = []; // Clear existing particles
        animate(); // Start the animation loop
    });

    canvas.addEventListener('click', createParticles);
});
