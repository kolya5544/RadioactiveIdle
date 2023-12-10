var scheduler, screens, fps;
var reactor, upgrades, stats, achievements;

function init(){
    document.getElementById("save").addEventListener("click", save);
    document.getElementById("reset").addEventListener("click", reset);
    
    upgrades = new Upgrades();
    initUpgrades();
    
    stats = new Stats();
    addStats();

    renderReactor();
    reactor = new Reactor();
    
    screens = new Screens();

    achievements = new Achievements();
    achievements.init();

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
};

function reset(){
    if(confirm("This will reset everything including any bonus score.")){
        stats.reset(true);
        upgrades.reset();
        reactor.reset();
        achievements.reset(true);
        localStorage.clear();
        save();
    }
};

function prestige(){
    var bonus = calc_prestige()+stats.get("heat");

    if (bonus > 0) {
        document.getElementById("heatCount").style.display = "";
    }

    stats.reset(false);
    upgrades.reset();
    stats.set("heat", bonus);
    reactor.reset();
    save();
};