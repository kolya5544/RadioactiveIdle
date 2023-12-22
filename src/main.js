var scheduler, screens, fps;
var reactor, upgrades, stats, achievements;

var playtime = null;

var loadedSuccessfully = false;

var firstLaunch = false;

function init(){
    document.getElementById("save").addEventListener("click", save);
    document.getElementById("reset").addEventListener("click", reset);

    achievements = new Achievements();
    achievements.init();

    upgrades = new Upgrades();
    initUpgrades();
    
    stats = new Stats();
    addStats();

    renderReactor();
    reactor = new Reactor();

    initHeatUpgrades();
    initMatterUpgrades();
    
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

    if (playtime == null) {
        playtime = document.getElementById("playtimeTotal");
    }

    // draw matter stuff
    if (stats.getAll("matter")[1] > 0) {
        document.getElementById("matterContainer").style.visibility = "";       
    }

    document.getElementById("automataCheckbox").checked = stats.automataMinionEnabled;

    start();
    
    //requestAnimFrame(update);
};
    
function update(draw_graphics = true){
    scheduler.update();
    screens.update();
    screens.draw();

    // update playtime
    playtime.innerText = forHumans(Math.floor((parseInt(Date.now()) - this.stats.time_of_beginning)/1000));

    // process meltdown
    if (upgrades.get("meltdown") > 0) {
        processMeltdown();
    }

    if (upgrades.get("heat_generator") > 0) {
        // woo!
        let bonus = calc_prestige();
        let oneSixth = (bonus / 10);
        let tickGain = Math.round(oneSixth / 60 / 60 * calc_tickrate() * 100) / 100; // / tickSpeed / minute

        stats.add("heat", tickGain);
    }

    // handle Automata Minions!
    if (achievements.get("Nuclear Automaton") && stats.automataMinionEnabled && tickCount % 20 == 0) {
        let cntBig = Math.max(200 - upgrades.get("size"), 0); // LARGE EXPLOSIONS
        let maxBig = Math.min(upgrades.upgrades["size"].getMaxBuyCount(), cntBig);
        if (cntBig > 0) upgrades.upgrades["size"].buy(maxBig);

        cntBig = Math.max(200 - upgrades.get("balls"), 0); // EXTRA ATOMS
        maxBig = Math.min(upgrades.upgrades["balls"].getMaxBuyCount(), cntBig);
        if (cntBig > 0) upgrades.upgrades["balls"].buy(maxBig);

        cntBig = Math.max(200 - upgrades.get("speed"), 0); // SPEEEEED
        maxBig = Math.min(upgrades.upgrades["speed"].getMaxBuyCount(), cntBig);
        if (cntBig > 0) upgrades.upgrades["speed"].buy(maxBig);
    }

    trackProgress();
    //requestAnimFrame(update);
};

function processMeltdown() {
    let current = stats.getAll("chain")[3];
    let perSecond = calc_meltdown_output(); 
    let perTick = perSecond / 60;

    stats.add("energy", perTick);

    // start a random reaction if less than 10% of balls are exploded
    if (reactor.explodes.count <= (reactor.balls.count + reactor.explodes.count) * 0.10 && reactor.balls.count > 0 && tickCount % 6 == 0) {
        for(var i in reactor.balls.objects){
            var ball = reactor.balls.objects[i];
            ball.explode([current]);
            return;
        }
    }

    // update stuff
    if (stats.get("heat") > 0) {
        document.getElementById("heatCount").style.display = "";
        document.getElementById("energyCount").style.display = "";
    }

    var m_p_e = document.getElementById("matterPrestigeElm");
    if (checkCanMatter()) {
        m_p_e.style.display = "";
    } else {
        m_p_e.style.display = "none";
    }

    // once per 3 seconds, spawn a big random explosion in the background
    /*if (tickCount % (60 * 3) == 0) {
        console.log("att");
        var expl = new Explosion(null, undefined, true);
        reactor.expl.add(expl);
    }*/
}

function save(){
    if (!loadedSuccessfully) return;

    localStorage.setItem("ver", "v1.0");
    upgrades.save();
    stats.save();
    achievements.save();
};

function load(){
    var version = localStorage.getItem("ver");
    if(typeof version === "object"){
        localStorage.clear();

        // very first launch! wooo!
        firstLaunch = true;
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
        document.getElementById("heatCount").style.display = "none";
        let prestigeCont = document.getElementById("prestigeContainer");
        prestigeCont.style.visibility = "hidden";
        localStorage.clear();
        save();
    }
};

function exportGame() {
    console.log(JSON.stringify(localStorage).replaceAll("\\\"", "'"));
}

function importGame(game) {
    var data = JSON.parse(game.replaceAll("'", "\\\""));
    Object.keys(data).forEach(function (k) {
        if (k == "achievements") {
            // custom handling
            let dt = data[k];

            dt = dt.replaceAll("Don\"t", "Don't")
                                   .replaceAll("Doesn\"t", "Doesn't")
                                   .replaceAll("It\"s", "It's")
                                   .replaceAll("didn\"t", "didn't");

            localStorage.setItem(k, dt);
            return;
        }
        localStorage.setItem(k, data[k]);
    });
    save = null;
}

function prestige(){
    upgrades.draw(true);
    if (!stats.sacrificedBefore) flash();
    stats.sacrificedBefore = true;

    var prev = stats.get("heat");
    var prevSac = stats.get("sacrifices");
    var prevMatter = stats.get("matter");
    var bonus = calc_prestige();

    if (bonus > 0) {
        document.getElementById("heatCount").style.display = "";
    }

    // "no longer needed" achievement check
    if (bonus >= 4 && upgrades.get("time") == 0) {
        achievements.setCompletion("No Longer Needed", true, true);
    }

    // "eight bits of heat" achievement check
    if (bonus >= 256) {
        achievements.setCompletion("Eight Bits of Heat", true, true);
    }

    // "Extremely F- wait, didn't I already unlock this achievement?"
    if (bonus >= 69420) {
        achievements.setCompletion("Extremely F- wait, didn't I already unlock this achievement?", true, true);
    }

    // "Radioactive: Now Idle!" achievement check
    if (bonus >= 16 && upgrades.get("time") == 0 && upgrades.get("size") == 0 && upgrades.get("balls") == 0 && upgrades.get("speed") == 0 && stats.get("clicks") == 0) {
        achievements.setCompletion("Radioactive: Now Idle!", true, true);
    }

    stats.reset(false);
    upgrades.reset();
    stats.set("sacrifices", prevSac);
    if (bonus > 0) stats.add("sacrifices", 1);
    stats.set("heat", prev);
    stats.add("heat", bonus);
    stats.set("matter", prevMatter);
    if (achievements.get("The Instigator")) stats.add("energy", 200);
    if (achievements.get("Actual Insanity")) stats.add("energy", 2000);
    stats.time_of_last_prestige = parseInt(Date.now());
    reactor.reset();
    save();

    var m_p_e = document.getElementById("matterPrestigeElm");
    if (checkCanMatter()) {
        m_p_e.style.display = "";
    } else {
        m_p_e.style.display = "none";
    }
};

function destroyReactor() {
    upgrades.draw(true);
    if (!achievements.get("Nobody Will Believe You")) flash();

    var prev = stats.get("matter");
    var prevSac = stats.get("destroys");
    var bonus = calc_matter_output();

    let upg = upgrades.getAll();
    if (upg[0] + upg[1] + upg[2] + upg[3] + upg[4] + upg[5] + upg[6] == 0 && stats.get("sacrifices") == 0) {
        achievements.setCompletion("Nuclear Automaton", true, true);
    }

    if (bonus > 0) {
        document.getElementById("matterCount").style.display = "";
    }

    if (calc_this_reaction_lifetime() <= 600) {
        achievements.setCompletion("It's A Never Ending Cycle", true, true);
    }

    if (calc_this_reaction_lifetime() <= 60) {
        achievements.setCompletion("Nobody Will Believe You", true, true);
    }

    // "in the end it does even matter" achievement unlock
    achievements.setCompletion("In The End, It Doesn't Even Matter", true, true);

    document.getElementById("heatCount").style.display = "none";

    stats.reset(false, true);
    upgrades.reset(false, true);
    stats.set("matter", prev);
    stats.add("matter", bonus);
    stats.time_of_last_reactor = parseInt(Date.now());

    // obviously
    prestige();

    stats.set("destroys", prevSac);
    if (bonus > 0) stats.add("destroys", 1);

    if (stats.getAll("matter")[1] > 0) {
        document.getElementById("matterContainer").style.visibility = "";       
    }

    if (upgrades.get("controllable_meltdown") > 0) {
        // woo!
        //stats.add("heat", 512);
        upgrades.set("meltdown", 1);
    }

    if (!isSacrificeUnlocked()) {
        let prestigeCont = document.getElementById("prestigeContainer");
        prestigeCont.style.visibility = "hidden";
    }

    if (achievements.get("Nuclear Automaton")) { 
        document.getElementById("automataLabel").style.display = "";
        document.getElementById("automataCheckbox").style.display = "";
    }

    if (stats.get("matter") >= 1000) {
        achievements.setCompletion("...but I thought there would be another prestige layer?", true, true);
    }
}

function automataCheckboxHandle() {
    let a = document.getElementById("automataCheckbox");
    stats.automataMinionEnabled = a.checked;
}

function keypress(e) {
    let keynum = String.fromCharCode(e.which).toLowerCase();
    
    if (keynum == "t") {
        rapidOfflineProgress = !rapidOfflineProgress;
    }
}