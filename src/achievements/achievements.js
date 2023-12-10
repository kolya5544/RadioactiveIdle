function Achievement(name, description, checkFunc = null, reward = null) {
    this.name = name;
    this.description = description;
    this.checkFunc = checkFunc;
    this.completed = false;
    this.reward = reward;
};
Achievement.prototype = {
    setCompletion: function(v, first_time = false) {
        this.completed = v;

        if (first_time && v) {
            achievements.triggerModal(this);
        }
    },

    draw: function() {
        let curr_name = this.name.replace(" ", "_").toLowerCase();
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
                iP = document.createAttribute("p");
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
        this.achievements[ach_name].setCompletion(value);
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
        for(var ach in this.achievements){
            ach = this.achievements[ach];
            if (ach.completed) continue;
            if (ach.checkFunc == null) continue;
            var l = ach.checkFunc();
            if (l) ach.setCompletion(true, true);
            ach.draw();
        }
    },
    
    draw: function(){
        for (var ach in this.achievements) {
            ach = this.achievements[ach];
            ach.draw();
        }
    }
}