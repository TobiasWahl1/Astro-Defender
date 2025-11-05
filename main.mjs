import { Asteroid } from "./js/asteroid.mjs";
import { Spaceship } from "./js/spaceship.mjs";
import { Joystick } from "./js/joystick.mjs";
import { ShootButton } from "./js/shootButton.mjs";

window.onload = () => {

    //GameOverDiv
    const gameOverDiv = document.getElementById("gameOver");
    const restartButton = document.getElementById("restartButton");

    restartButton.addEventListener("touchstart", () => {
        gameOverDiv.style.display = "none";
        startRound();
    });
    restartButton.addEventListener("click", () => {
        gameOverDiv.style.display = "none";
        startRound();
    });

    //InfoBox
    const infoBox = document.getElementById("infoBox");
    
    //Button zum Starten
    const startButton = document.getElementById("startButton");

    startButton.addEventListener("touchstart", startRound)
    startButton.addEventListener("click", startRound);
    
    let startCd = 3;
    let countdownActive = false; 

    function startRound(event){
        if(event) event.preventDefault();
        document.getElementById("infoBox").style.display = "none";

        startCd = 3; //Countdown von 3
        countdownActive = true;

        const timer = setInterval(() => {
            startCd--;
            if(startCd <= 0){
                clearInterval(timer);
                countdownActive = false;
            }
        }, 1000);
        startGame();
    }
    
    function startGame(){

        let gameOver = false;
        let gameRunning = true;

        //Spielfeld
        const cnv = document.getElementById("cnv");
        const ctx = cnv.getContext("2d");

        //Joystick
        const jCnv = document.getElementById("joystick");
        const jCtx = jCnv.getContext("2d");

        //Fire Button
        const sCnv = document.getElementById("fire");
        const sCtx = sCnv.getContext("2d");

        const ship = new Spaceship(cnv.width / 2, cnv.height / 2, ctx);
        ship.shields = 3;
        const joystick = new Joystick(jCnv.width / 2, jCnv.height / 2, jCtx, jCnv);
        const shootButton = new ShootButton(sCnv.width /2, sCnv.height / 2, sCtx);

        //Spwan Mehrere Asteroiden
        const asteroids = [];
        for(let i = 0; i < 8; i++){
            asteroids.push(new Asteroid(cnv.width, cnv.height, ctx));
        }
    
        function gameLoop(){
            ctx.clearRect(0, 0, cnv.width, cnv.height);

            if(!gameRunning) return;

            if (!countdownActive && !gameOver) {
                ship.update(joystick);
                asteroids.forEach(ast => ast.update());
            }

            ship.draw();
            asteroids.forEach(ast => ast.draw());
            joystick.update();
            joystick.draw();
            shootButton.draw();

            // Draw countdown overlay if active
            if (countdownActive) {
                ctx.save();
                ctx.fillStyle = "white";
                ctx.font = "bold 60px Arial";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(startCd, cnv.width / 2, cnv.height / 2);
                ctx.restore();
            }

            if (ship.shields <= 0) {
                gameRunning = false;
                gameOverDiv.style.display = "flex";
                return; // stop updating this frame
            }

            if(gameOver) return;
            

            for (let i = 0; i < asteroids.length; i++) {
                const a1 = asteroids[i];

                // --- Asteroid-Asteroid Collisions ---
                for (let j = i + 1; j < asteroids.length; j++) {
                    const a2 = asteroids[j];
                    const dx = a2.x - a1.x;
                    const dy = a2.y - a1.y;
                    const dist = Math.hypot(dx, dy);
                    const minDist = a1.radius + a2.radius;

                    if (dist < minDist) {
                        // Normalize direction
                        const nx = dx / dist;
                        const ny = dy / dist;

                        // Simple elastic bounce by swapping components
                        const p = 2 * (a1.vx * nx + a1.vy * ny - a2.vx * nx - a2.vy * ny) / 2;

                        a1.vx -= p * nx;
                        a1.vy -= p * ny;
                        a2.vx += p * nx;
                        a2.vy += p * ny;

                        // Separate overlapping
                        const overlap = (minDist - dist) / 2;
                        a1.x -= nx * overlap;
                        a1.y -= ny * overlap;
                        a2.x += nx * overlap;
                        a2.y += ny * overlap;
                    }
                }

            // --- Spaceship-Asteroid Collision ---
            const dx = ship.x - a1.x;
            const dy = ship.y - a1.y;
            const dist = Math.hypot(dx, dy);
            const minDist = ship.radius + a1.radius;

            if (dist < minDist) {
                // Bounce ship away
                const nx = dx / dist;
                const ny = dy / dist;

                // Reflect ship velocity (approximation)
                ship.x += nx * (minDist - dist);
                ship.y += ny * (minDist - dist);
                a1.vx = -a1.vx * 0.8;
                a1.vy = -a1.vy * 0.8;

                // Damage the ship
                if (!ship.invincible) {
                    ship.shields--;
                    ship.invincible = true;
                    setTimeout(() => ship.invincible = false, 1000); // 1s invulnerability
                    console.log(`Ship hit! Shields left: ${ship.shields}`);

                    if(ship.shields <= 0){
                        gameRunning = false;
                        gameOverDiv.style.display = "flex";
                        return;
                    }
                }
            }
        }

            requestAnimationFrame(gameLoop);
        }
        gameLoop();
    }
}