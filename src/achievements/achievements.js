function Achievement(name, description, checkFunc = null, reward = null) {
    this.name = name;
    this.description = description;
    this.checkFunc = checkFunc;
    this.completed = false;
    this.reward = reward;
};
Achievement.prototype = {
    setCompletion: function(v, first_time = false) {
        if (first_time && v && !this.completed) {
            achievements.triggerModal(this);
        }

        this.completed = v;
    },

    draw: function() {
        let curr_name = this.name.replace(/[^\w\s]/gi, '').replace(" ", "_").toLowerCase();
        let el = document.getElementById(curr_name);
        if (el == null) {
            // draw it!
            let div = document.getElementById("achievements");

            let iDiv = document.createElement("div");
            iDiv.className = "achievement";
            iDiv.id = curr_name;

            div.appendChild(iDiv);
            
            let iP = document.createElement("p");
            if (this.reward != null) iP.className = "no_lower_margin";
            iP.innerHTML = `<i>${this.name}</i> - ${this.description}`;

            iDiv.appendChild(iP);

            let iSpan = document.createElement("span");
            iSpan.className = "achievement_status";
            iSpan.innerText = "COMPLETED";
            if (!this.completed) iSpan.style.display = "none";

            iDiv.appendChild(iSpan);

            if (this.reward != null) {
                iP = document.createElement("p");
                iP.className = "subtext no_upper_margin";
                iP.innerHTML = `<strong>Reward:</strong> ${this.reward}`;

                iDiv.appendChild(iP);
            }
        } else {
            if (this.completed) {
                let iSpan = el.querySelector("span");
                iSpan.style.display = "";
            }
        }
    },
};

function Achievements(){
    this.achievements = {};
};

Achievements.prototype = {
    init: function() { // this loads all achievements
        // get first energy point
        this.addNewAchievement("New Beginnings", "Earn your first Energy", check_new_beginnings);
        this.addNewAchievement("Chain Reaction", "Get a continuous chain reaction of more than 2000 atoms", check_chain_reaction);
        this.addNewAchievement("Reactor Incremental", "Get your first Heat Point", check_reactor_incremental);
        this.addNewAchievement("Nine Cirlces of Hell", "Sacrifice a total of 9 times (each Sacrifice should be for at least 1 Heat Points)", check_nine_circles_of_hell);
        this.addNewAchievement("All It Takes Is A Spark", "Upgrade your Energy Multiplier 5 times", check_all_it_takes_is_a_spark, "start new games with 2 additional atoms");
        this.addNewAchievement("Confined Space", "Get a total of 50.000 explosions", check_confined_space, "reactor size increase is significantly delayed");
        this.addNewAchievement("Don't You Have Something Better To Do?", "Play the game a total of 4 hours", check_dont_you_have_something_better_to_do);
        this.addNewAchievement("Cookie Clicker", "Click a total of 1.000 times (pro tip: it's sometimes faster to click than to wait!)", check_cookie_clicker);
        this.addNewAchievement("We Need To Go BIGGER", "Buy more than 50 bigger explosion upgrades in a single click", null, "explosions are slightly bigger");
        this.addNewAchievement("No Longer Needed", "Sacrifice for at least four Heat Points without upgrading Longer Explosions at all", null, "Energy Multiplier is a bit more powerful");
        this.addNewAchievement("Positively Charged", "Get a total of 1 billion Energy", check_positively_charged);
        this.addNewAchievement("Rich Boi", "Get Enriched Atoms", null, "a lot more lenient Sacrifice formula for bigger Energy values");
        this.addNewAchievement("The Instigator", "Reach 200 million Energy in no more than two reactor clicks", check_the_instigator, "start every new run with 200 Energy");
        this.addNewAchievement("Speedrun", "Reach 1 heat point in less than 100 explosions", check_speedrun, "you get twice as much heat points on sacrifice");
        this.addNewAchievement("The Burning Souls", "Sacrifice for a total of 666 Heat Points", check_the_burning_souls);
        this.addNewAchievement("Eight Bits of Heat", "Get more than 256 Heat Points in a single Sacrifice", null, "you get a very small bonus to your Energy and Heat output for every hour played");
        this.addNewAchievement("Chernobyl Disaster", "Start a reactor Meltdown", null);
        this.addNewAchievement("Minor Inconvenience", "Get more than 50 Longer Explosions upgrades after getting Meltdown", check_minor_inconvenience, "a great life lesson");
        this.addNewAchievement("Radioactive: Now Idle!", "Sacrifice for at least 16 Heat Points without a single upgrade or click", null);
        this.addNewAchievement("Modern Problems Require a Lot of Energy", "Get 100 billion Energy", check_modern_problems, "you get more Heat Points on Sacrifice the more time you spent since last Sacrifice (caps at 5 hours)");
        //this.addNewAchievement("Bomberman", "Reach 200 million Energy in no more than two reactor clicks", check_the_instigator, "start every new run with 200 Energy");
        //this.addNewAchievement("The One Achievement to Rule Them All", "", check_cookie_clicker);

        this.draw();
    },

    load: function(){
        var saved = JSON.parse(localStorage.getItem("achievements"));
        for(var ach in saved){
            this.setCompletion(ach, saved[ach]);
            console.log(ach);
        }
    },
    
    save: function(){
        var toSave = {};
        for(var ach in this.achievements){
            toSave[ach] = this.get(ach);
        }
        localStorage.setItem("achievements", JSON.stringify(toSave));
    },
    
    reset: function(hardReset = false){
        if (hardReset) {
            for(var ach in this.achievements){
                this.setCompletion(ach, false);
            }
        }
    },

    setCompletion: function(ach_name, value, first_time = false) {
        this.achievements[ach_name].setCompletion(value, first_time);
    },

    triggerModal: function(ach) {
        let modal = document.getElementById("achievementFooter");
        let content = document.getElementById("achievementFooterContent");
        content.innerText = `You unlocked a new achievement: ${ach.name}`;
        modal.className = "achievementShown";
        setTimeout(this.hideModals, 3000);
    },

    hideModals: function(ach) {
        let modal = document.getElementById("achievementFooter");
        modal.className = "achievementHidden";
    },
    
    set: function(ach, value){
        this.achievements[ach] = value;
    },
    
    get: function(ach){
        return this.achievements[ach].completed;
    },

    addNewAchievement: function(name, description, checkFunc, reward = null) {
        var ach = new Achievement(name, description, checkFunc, reward);
        this.set(name, ach);
        this.achievements[name] = ach;
    },
    
    update: function(){
        //console.log(document.hasFocus());
        //if (offlineProgressOn || !document.hasFocus()) return;

        for(var ach in this.achievements){
            ach = this.achievements[ach];
            ach.draw();
            if (ach.completed) continue;
            if (ach.checkFunc == null) continue;
            var l = ach.checkFunc();
            if (l) ach.setCompletion(true, true);
        }
    },
    
    draw: function(){
        for (var ach in this.achievements) {
            ach = this.achievements[ach];
            ach.draw();
        }
    }
}