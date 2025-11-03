import { Asteroid } from "./js/asteroid.mjs";
import { Spaceship } from "./js/spaceship.mjs";
import { Joystick } from "./js/joystick.mjs";
import { ShootButton } from "./js/shootButton.mjs";

window.onload = () => {

    //InfoBox
    const infoBox = document.getElementById("infoBox");
    
    //Button zum Starten
    const startButton = document.getElementById("startButton");

    startButton.addEventListener("touchstart", startRound)
    startButton.addEventListener("click", startRound);
    
    let startCd = 3;
    let countdownActive = false; 

    function startRound(event){
        event.preventDefault();
        startButton.style.display = "none";
        infoBox.style.display = "none";

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
        const joystick = new Joystick(jCnv.width / 2, jCnv.height / 2, jCtx, jCnv);
        const shootButton = new ShootButton(sCnv.width /2, sCnv.height / 2, sCtx);

        //Spwan Mehrere Asteroiden
        const asteroids = [];
        for(let i = 0; i < 8; i++){
            asteroids.push(new Asteroid(cnv.width, cnv.height, ctx));
        }
    
        function gameLoop(){
            ctx.clearRect(0, 0, cnv.width, cnv.height);

            if (!countdownActive) {
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

            requestAnimationFrame(gameLoop);
        }
        gameLoop();
    }
}