var scheduler, screens, fps;
var reactor, upgrades, stats, achievements;

var loadedSuccessfully = false;

function init(){
    document.getElementById("save").addEventListener("click", save);
    document.getElementById("reset").addEventListener("click", reset);

    upgrades = new Upgrades();
    initUpgrades();

    achievements = new Achievements();
    achievements.init();
    
    stats = new Stats();
    addStats();

    renderReactor();
    reactor = new Reactor();

    initHeatUpgrades();
    
    screens = new Screens();

    screens.addScreen("reactor", reactor, "Reactor");
    screens.addScreen("upgrades", upgrades, "Upgrades");
    screens.addScreen("stats", stats, "Statistics");
    screens.addScreen("achievements", achievements, "Achievements");

    fps = new FPS();
    scheduler = new Scheduler();
    scheduler.add(save, 3600);
    scheduler.add(fps.update.bind(fps), 10);
    
    load();

    renderPrestige();

    start();
    
    //requestAnimFrame(update);
};
    
function update(draw_graphics = true){
    scheduler.update();
    screens.update();
    screens.draw();
    trackProgress();
    //requestAnimFrame(update);
};

function save(){
    if (!loadedSuccessfully) return;

    localStorage.setItem("ver", "v0.1");
    upgrades.save();
    stats.save();
    achievements.save();
};

function load(){
    var version = localStorage.getItem("ver");
    if(typeof version === "null"){
        localStorage.clear();
    }
    upgrades.load();
    stats.load();
    achievements.load();

    // update subtext
    for (var upgr in this.upgrades.upgrades) {
        upgr = this.upgrades.upgrades[upgr];
        upgr.updateSubtext();
    }

    loadedSuccessfully = true;
};

function reset(){
    if(confirm("This will reset everything including any bonus score.")){
        stats.reset(true);
        upgrades.reset(true);
        reactor.reset();
        achievements.reset(true);
        localStorage.clear();
        save();
    }
};

function exportGame() {
    console.log(JSON.stringify(localStorage));
}

function importGame(game) {
    var data = JSON.parse(game);
    Object.keys(data).forEach(function (k) {
        localStorage.setItem(k, JSON.stringify(data[k]));
    });
    save = null;
}

function prestige(){
    var prev = stats.get("heat");
    var prevSac = stats.get("sacrifices");
    var bonus = calc_prestige();

    if (bonus > 0) {
        document.getElementById("heatCount").style.display = "";
    }

    stats.reset(false);
    upgrades.reset();
    stats.set("sacrifices", prevSac);
    if (bonus > 0) stats.add("sacrifices", 1);
    stats.set("heat", prev)
    stats.add("heat", bonus);
    reactor.reset();
    save();
};