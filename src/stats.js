function addStats(){
    stats.addStat("energy", 2);
    stats.addStat("explosions", 0);
    stats.addStat("chain", 0);
    stats.addStat("clicks", 0);
    stats.addStat("heat", 2);
    stats.addStat("sacrifices", 0);
    stats.addStat("matter", 0);
    stats.addStat("destroys", 0);

    renderStats();
};

function Stat(name, decimal){
    this.name = name;
    this.elems = null;
    this.values = [0,0,0,0,0]; //value, max, total, max this run, max this reactor
    this.exponent = decimal;
    this.decimal = Math.pow(10, decimal);
};

Stat.prototype = {
    set: function(value){
        var value = Math.round(value*this.decimal)
        this.values[0] = value;
        if(this.values[0] > this.values[2]){
            this.values[2] = this.values[0];
        }
        if (this.values[0] > this.values[3]){
            this.values[3] = this.values[0];
        }
        if (this.values[0] > this.values[4]){
            this.values[4] = this.values[0];
        }
    },
    
    setAll: function(values){
        for(var i in values){
            this.values[i] = Math.round(values[i]*this.decimal);
        }
    },
    
    add: function(value){
        var value = Math.round(value*this.decimal)
        this.values[0] += value;
        if(value>0){
            this.values[1] += value;
        }
        if(this.values[0] > this.values[2]){
            this.values[2] = this.values[0];
        }
        if (this.values[0] > this.values[3]) {
            this.values[3] = this.values[0];
        }
        if (this.values[0] > this.values[4]){
            this.values[4] = this.values[0];
        }
    },
    
    get: function(i){
        return this.values[i]/this.decimal;
    },
    
    getAll: function(i){
        return [this.get(0), this.get(1), this.get(2), this.get(3), this.get(4)];
    },
    
    draw: function(){
        for(var i in this.values){
            if(this.elems[i]){ //not null
                let v = this.get(i);
                if (this.getAll(i)[2] == 0) { this.elems[i].parentElement.style.display = "none"; } else { this.elems[i].parentElement.style.display = ""; }
                this.elems[i].innerHTML = ""+stringify(v);
            }
        }
    },

    newRun: function() {
        this.values[3] = this.values[0];
    },
};

function Stats(){
    this.stats = {};
    this.time_of_beginning = 0;
    this.time_of_save = 0;
    this.time_of_last_prestige = 0;
    this.time_of_last_reactor = 0;
};

Stats.prototype = {
    load: function(){
        var saved = JSON.parse(localStorage.getItem("stats"));
        for(var stat in saved){
            this.setAll(stat, saved[stat]);
        }
        let tob = localStorage.getItem("time_of_beginning");
        this.time_of_beginning = tob == null ? parseInt(Date.now()) : parseInt(tob);

        let tos = localStorage.getItem("time_of_save");
        this.time_of_save = tos == null ? 0 : parseInt(tos);

        let top = localStorage.getItem("time_of_last_prestige");
        this.time_of_last_prestige = top == null ? parseInt(Date.now()) : parseInt(top);

        let tor = localStorage.getItem("time_of_last_reactor");
        this.time_of_last_reactor = tor == null ? parseInt(Date.now()) : parseInt(tor);
    },
    
    save: function(){
        var toSave = {};
        for(var stat in this.stats){
            toSave[stat] = this.getAll(stat);
        }
        localStorage.setItem("stats", JSON.stringify(toSave));
        localStorage.setItem("time_of_beginning", this.time_of_beginning);
        localStorage.setItem("time_of_save", parseInt(Date.now()));
        localStorage.setItem("time_of_last_prestige", this.time_of_last_prestige);
        localStorage.setItem("time_of_last_reactor", this.time_of_last_reactor);
    },
    
    reset: function(hardReset = false, matterReset = false){
        if(hardReset){
            for(var stat in this.stats){
                this.setAll(stat, [0, 0, 0, 0, 0]);
            }
            this.time_of_beginning = parseInt(Date.now());
        }else{
            for(var stat in this.stats){
                this.set(stat, 0)
                this.newRun(stat);
                if (matterReset) {
                    if (stat == "matter") {
                        let v = this.getAll("matter");
                        this.setAll(stat, [0, v[1], v[2], v[3], v[4]]);
                        continue;
                    }
                    this.setAll(stat, [0, 0, 0, 0, 0]);
                }
            }
        }
    },
    
    addStat: function(stat, decimal){
        this.stats[stat] = new Stat(stat, decimal);
    },
    
    set: function(stat, value){
        this.stats[stat].set(value);
    },
    
    setAll: function(stat, values){
        this.stats[stat].setAll(values);
    },

    newRun: function(stat) {
        this.stats[stat].newRun();
    },

    newReactor: function(stat) {
        // todo this.stats[stat].newReactor();
    },
    
    add: function(stat, value){
        this.stats[stat].add(value);
    },
    
    get: function(stat){
        return this.stats[stat].get(0);
    },
    
    getAll: function(stat){
        return this.stats[stat].getAll();
    },
    
    update: function(){
        this.stats["energy"].draw();
    },
    
    draw: function(){
        for(var key in this.stats){
            this.stats[key].draw();
        }
    }
}