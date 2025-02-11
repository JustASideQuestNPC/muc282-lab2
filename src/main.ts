// constants
const CANVAS_WIDTH: number = 600;
const CANVAS_HEIGHT: number = 600;

// buttons
let phaseSlider: p5.Element;

// buffer to draw the mask onto
let maskBuffer: p5.Graphics;

// the image of the moon
let moonImage: p5.Image;

/**
 * Whether everything has finished loading - if this is false, lots of things will be undefined!
 */
let asyncLoadingComplete = false;

/**
 * Draws the moon.
 */
function drawMoon(phase: number): void {
    // reset the mask
    maskBuffer.background("#000000");
    maskBuffer.push();
    maskBuffer.translate(maskBuffer.width / 2, maskBuffer.height / 2);
    maskBuffer.scale(2.1); // easier than redoing all the math

    // carve out the parts of the moon that are visible
    maskBuffer.noStroke();
    
    if (phase > 0 && phase < 16) {
        maskBuffer.erase();
        maskBuffer.arc(0, 0, 200, 200, -PI / 2, PI / 2);
        maskBuffer.noErase();

        if (phase < 8) {
           maskBuffer.fill("#000000");
           maskBuffer.arc(0, 0, map(phase, 0, 8, 200, 0), 200, -PI / 2, PI / 2);
        }
        else if (phase > 8) {
            maskBuffer.erase();
            maskBuffer.arc(0, 0, map(phase, 8, 16, 0, 200), 200, PI / 2, PI * 3 / 2);
            maskBuffer.noErase();
        }
    }
    else if (phase === 16) {
        maskBuffer.erase();
        maskBuffer.circle(0, 0, 200);
        maskBuffer.noErase();
    }
    else if (phase > 16 && phase < 32) {
        maskBuffer.erase();
        maskBuffer.arc(0, 0, 200, 200, PI / 2, PI * 3 / 2);
        maskBuffer.noErase();

        if (phase < 24) {
            maskBuffer.erase();
            maskBuffer.arc(0, 0, map(phase, 16, 24, 200, 0), 200, -PI / 2, PI / 2);
            maskBuffer.noErase();
        }
        else if (phase > 24) {
            maskBuffer.fill("#000000");
            maskBuffer.arc(0, 0, map(phase, 24, 32, 0, 200), 200, PI / 2, PI * 3 / 2);
        }
    }

    maskBuffer.pop();

    imageMode("center");
    image(moonImage, width / 2, height / 2, 500, 500);
    imageMode("corner");

    image(maskBuffer, 0, 0);
}

// for disabling and reenabling keyboard input
let canvasHovered = true;

function setup() {
    const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

    phaseSlider = createSlider(0, 32, 16, 0.1)
                 .parent("buttonContainer");

    maskBuffer = createGraphics(CANVAS_WIDTH, CANVAS_HEIGHT);

    // WHY CAN'T I AWAIT THIS??????
    moonImage = loadImage("../assets/FullMoon2010.jpg",
        () => { asyncLoadingComplete = true; }
    );

    // WHY DO THESE USE CALLBACKS????
    canvas.mouseOver(() => {
        canvasHovered = true;
    });
    canvas.mouseOut(() => {
        canvasHovered = false;
    });

    // this is the only way to make mouse functions only trigger when the mouse is actually over the
    // canvas. I SHOULD NOT HAVE TO DO THIS.
    canvas.mousePressed(_mousePressed);
    canvas.mouseReleased(_mouseReleased);

    // this is, as far as i'm aware, the only way to disable the right-click menu without also
    // disabling it for the entire webpage. I SHOULD NOT HAVE TO DO THIS EITHER.
    document.querySelector("canvas").addEventListener("contextmenu", e => e.preventDefault());

    canvas.parent("sketchContainer");
}

function draw() {
    // draw a loading screen if the image hasn't been loaded yet
    if (!asyncLoadingComplete) {
        background("#000000");
        textSize(64);
        textAlign("center", "center")
        noStroke();
        fill("#ffffff")
        text("Loading...", width / 2, height / 2);

        // skip the rest of draw
        return;
    }

    background("#000000");

    // mildly cursed hack to keep typescript happy
    const value = phaseSlider.value();
    drawMoon(typeof value === "string" ? Number.parseInt(value) : value);

    textSize(24);
    textAlign("left", "top")
    noStroke();
    fill("#00ff00");
    text(phaseSlider.value(), 5, 10);
}

function _mousePressed() {

}

function _mouseReleased() {
    // console.log(`pressed ${mouseButton}`);
}

function keyPressed(event: KeyboardEvent) {
    // only run when the mouse is over the canvas; also makes F12 open the debug console instead of
    // interacting with the sketch
    if (canvasHovered && event.key !== "F12") {
        // console.log(`pressed ${event.key}`);

        // prevents default browser behavior
        return false;
    }
}

function keyReleased(event: KeyboardEvent) {
    // only run when the mouse is over the canvas; also makes F12 open the debug console instead of
    // interacting with the sketch
    if (canvasHovered && event.key !== "F12") {
        // console.log(`released ${event.key}`);

        // prevents default browser behavior
        return false;
    }
}