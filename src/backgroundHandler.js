// this makes sure the game background is appropriate during all stages of the game
// current stages:
// 1. pre-Sacrifice
// 2. pre-Extraction
// 3. pre-Meltdown
// 4. pre-Destroy
// the background then cycles if the reactor is destroyed

// ^ TODO

// this is also responsible for the flash of light when you:
// 1. explode your first atom (only in the very first run)
// 2. Sacrifice for the first time
// 3. get Meltdown for the first time
// 4. every time you Destroy

function setNewBackground(id) {
    document.body.style.backgroundImage = "";
}

function flash() {
    let z = document.getElementById("overlay");
    z.className = "overlay overlayComplete";
    setTimeout(() => { document.getElementById("overlay").className = "overlay"; }, 1500);
}