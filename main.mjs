import { Asteroid } from "./js/asteroid.mjs";
import { Spaceship } from "./js/spaceship.mjs";
import { Joystick } from "./js/joystick.mjs";
import { ShootButton } from "./js/shootButton.mjs";

window.onload = () => {
    
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
    const asteroid = new Asteroid(cnv.width / 2, cnv.height / 2, ctx);
    const joystick = new Joystick(jCnv.width / 2, jCnv.height / 2, jCtx, jCnv);
    const shootButton = new ShootButton(sCnv.width /2, sCnv.height / 2, sCtx);

    function gameLoop(){
        ctx.clearRect(0, 0, cnv.width, cnv.height);
        ship.update();
        ship.draw();
        //asteroid.update();
        //asteroid.draw();
        joystick.update();
        joystick.draw();
        shootButton.draw();

        requestAnimationFrame(gameLoop);
    }
    gameLoop();
}