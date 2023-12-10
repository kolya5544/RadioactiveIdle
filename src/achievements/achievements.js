function Achievement(name, description, checkFunc = null, reward = null) {
    this.name = name;
    this.description = description;
    this.checkFunc = checkFunc;
    this.completed = false;
    this.reward = this.reward;
};
Achievement.prototype = {
    setCompletion: function(v) {
        this.completed = v;
    },

    draw: function() {
        let el = document.getElementById(this.name.replace(" ", "_").toLowerCase());
        if (el == null) {
            // draw it!
            let div = document.getElementById("achievements");

            
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
        for(var stat in this.stats){
            this.setCompletion(stat, false);
        }
    },

    setCompletion: function(ach, value) {
        this.achievements[ach.name].setCompletion(value);
    },
    
    set: function(ach, value){
        this.achievements[ach] = value;
    },
    
    get: function(ach){
        return this.achievements[ach].completed;
    },

    addNewAchievement: function(name, description, checkFunc) {
        var ach = new Achievement(name, description, checkFunc);
        this.set(ach.name, ach);
        this.achievements[ach.name] = ach;
    },
    
    update: function(){
        for(var ach in this.achievements){
            ach = this.achievements[ach];
            if (ach.completed) return;
            if (ach.checkFunc == null) return;
            var l = ach.checkFunc();
            if (l) ach.completed = true; // TODO alarm at user for completing the achievement
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