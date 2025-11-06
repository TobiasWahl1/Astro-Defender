import { Asteroid } from "./js/asteroid.mjs";
import { Spaceship } from "./js/spaceship.mjs";
import { Joystick } from "./js/joystick.mjs";
import { ShootButton } from "./js/shootButton.mjs";
import { Bullet } from "./js/bullet.mjs";
import { polygonCircleCollision } from "./js/canvasUtils.mjs";

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

        // Spielfeld
        const cnv = document.getElementById("cnv");
        const ctx = cnv.getContext("2d");

    const ship = new Spaceship(cnv.width / 2, cnv.height / 2, ctx);
    ship.shields = 3;

        // Separate control canvases beside the game field
        const jCnv = document.getElementById("joystick");
        const jCtx = jCnv.getContext("2d");
        const sCnv = document.getElementById("fire");
        const sCtx = sCnv.getContext("2d");

    // Center controls within their own canvases
    const joystick = new Joystick(jCnv.width / 2, jCnv.height / 2, jCtx);
    const shootButton = new ShootButton(sCnv.width / 2, sCnv.height / 2, sCtx);

        const bullets = [];
        let score = 0;

        //Spwan Mehrere Asteroiden
        const asteroids = [];
        for(let i = 0; i < 8; i++){
            asteroids.push(new Asteroid(cnv.width, cnv.height, ctx));
        }
    
        // No touch listeners on game canvas; each control canvas handles its own via TouchHandler

        function gameLoop(){
            ctx.clearRect(0, 0, cnv.width, cnv.height);

            if(!gameRunning) return;

            if (!countdownActive && !gameOver) {
                ship.update(joystick);
                asteroids.forEach(ast => ast.update());
            }

            ship.draw();
            asteroids.forEach(ast => ast.draw());
            bullets.forEach(b => b.draw());

            //Update Bullets
            for(const bullet of bullets){
                bullet.update();
            }

            //Bullet-Asteroid Kollision
            for(const bullet of bullets){
                for(let i = asteroids.length - 1; i >= 0; i--){
                    const ast = asteroids[i];
                    const dx = bullet.x - ast.x;
                    const dy = bullet.y - ast.y;
                    const dist = Math.hypot(dx, dy);
                    const points = ast.getVertices(); // you'll add this method to Asteroid
                    if (polygonCircleCollision(points, bullet.x, bullet.y, bullet.radius)) {
                        bullet.active = false;
                        asteroids.splice(i, 1);
                        score++;
                        console.log("Score:", score);
                        break;
                    }
                }
            }

            //Entferne Inaktive Bullets
            for (let i = bullets.length - 1; i >= 0; i--) {
                if (!bullets[i].active) bullets.splice(i, 1);
            }

            // Update and draw controls on their own canvases
            joystick.update();
            joystick.draw();
            shootButton.draw();

            if(shootButton.canShoot()){
                //Tip of Ship = position + forward Vector * ship.size
                const tipX = ship.x + Math.cos(ship.angle) * ship.size;
                const tipY = ship.y + Math.sin(ship.angle) * ship.size;
                bullets.push(new Bullet(tipX, tipY, ship.angle, ctx));
            }

            // Zeige Countdown Overlay
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
                return;
            }

            if(gameOver) return;
            

            for (let i = 0; i < asteroids.length; i++) {
                const a1 = asteroids[i];

                // Asteroid-Asteroid Kollision
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

                        // Elastic Bounce
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

                // Spaceship-Asteroid Kollision
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
            //Respawn Asteroiden wenn zu wenige
            if (asteroids.length < 8) {
                const newAsteroid = new Asteroid(cnv.width, cnv.height, ctx);
                asteroids.push(newAsteroid);
            }

            requestAnimationFrame(gameLoop);
        }
        gameLoop();
    }
}