function initUpgrades(){
    upgrades.addUpgrade("size", 0, "Bigger Explosions").cost(10, 1.1).button([1, 0]);
    upgrades.addUpgrade("time", 0, "Longer Explosions").cost(10, 1.1).button([1, 0]);
    upgrades.addUpgrade("speed", 0, "Faster Atoms").cost(10, 1.1).button([1, 0]);
    upgrades.addUpgrade("balls", 0, "Extra Atoms").cost(50, 1.1).button([1, 0]);
};

function Upgrade(res, elem, decimal, displayName){
    this.res = res;
    this.value = 0;
    this.exponent = decimal;
    this.decimal = Math.pow(10, decimal);
    this.tableElem = elem;
    this.displayName = displayName;
};

Upgrade.prototype = {
    cost: function(factor, base){
        this.getCost = function(num){
            if(typeof num === "undefined"){
                num = 1;
            }
            return factor*(Math.pow(base,this.get())-Math.pow(base,this.get()+num))/(1-base)
        }
        this.getMaxBuy = function(money){
            return Math.floor(Math.log(Math.pow(base,this.get())-money*(1-base)/factor)/Math.log(base) - this.get());
        }
        this.costElem = this.tableElem.children[4];
        return this;
    },
    
    button: function(counts){
        let elem = this.tableElem.children[2];

        this.buttonElems = elem.children;
        for(var i in counts){
            this.buttonElems[i].addEventListener("click", this.buy.bind(this, counts[i]));
            this.buttonElems[i].className = "button inactive";
        }
        return this;
    },
    
    set: function(value){
        this.value = Math.round(value*this.decimal);
    },
    
    add: function(value){
        this.value += Math.round(value*this.decimal);
    },
    
    get: function(){
        return this.value/this.decimal;
    },
    
    hasCost: function(amount){
        if(amount<=0){
            amount = 1;
        }
        return stats.get("energy") >= this.getCost(amount);
    },
    
    buy: function(amount){
        if(amount <= 0){
            var amount = this.getMaxBuy(stats.get("energy"))
        }
        var cost = this.getCost(amount)
        if(stats.get("energy") >= cost){
            stats.add("energy", -cost);
            this.add(amount);
        }
        this.updateSubtext();
    },
    
    draw: function(){
        let valueElem = this.tableElem.children[1];

        valueElem.innerHTML = ""+stringify(this.get());
        if(typeof this.getCost !== "undefined"){
            var cost = this.getCost();
            this.costElem.innerHTML = " "+stringify(cost);
            if(stats.get("energy") >= cost){
                this.buttonElems[0].className = "button active"
                this.buttonElems[1].className = "button active"
            }else{
                this.buttonElems[0].className = "button inactive"
                this.buttonElems[1].className = "button inactive"
            }
        }
    },

    updateSubtext: function(){
        let subtextEl = this.tableElem.children[5];
        var suffix = "";
        var prev = -1;
        var next = -1;

        switch (this.res) {
            case "speed":
                prev = calc_actual_speed(this.value);
                next = calc_actual_speed(this.value + 1);
                break;
            case "time":
                prev = calc_actual_explosion_time(this.value) / 60;
                next = calc_actual_explosion_time(this.value + 1) / 60;
                suffix = "s";
                break;
            case "size":
                prev = calc_actual_explosion_size(this.value);
                next = calc_actual_explosion_size(this.value + 1);
                break;
            case "balls":
                prev = this.value;
                next = this.value + 1;
                break;
        }

        if (prev == -1 || next == -1) { subtextEl.style.display = "none"; return; }
        prev = Math.floor(prev * 100) / 100;
        next = Math.floor(next * 100) / 100;

        subtextEl.innerText = `(${prev}${suffix} → ${next}${suffix})`;
    }
};

function Upgrades(){
    this.upgrades = {};
    this.newBonusElem = undefined;
    this.heatCount = undefined;
};

Upgrades.prototype = {
    load: function(){
        var saved = JSON.parse(localStorage.getItem("res"));
        for(var res in saved){
            this.set(res, saved[res]);
        }
    },
    
    save: function(){
        var toSave = {};
        for(var res in this.upgrades){
            toSave[res] = this.get(res);
        }
        localStorage.setItem("res", JSON.stringify(toSave));
    },
    
    reset: function(){
        for(var res in this.upgrades){
            this.set(res, 0);
        }
    },
    
    addUpgrade: function(res, decimal, displayName = "Basic Upgrade"){
        // render new upgrade
        renderUpgrade(res, displayName);
        elem = document.getElementById(res);

        this.upgrades[res] = new Upgrade(res, elem, decimal, displayName);
        this.upgrades[res].updateSubtext();
        return this.upgrades[res];
    },
    
    set: function(res, value){
        this.upgrades[res].set(value);
    },
    
    add: function(res, value){
        this.upgrades[res].add(value);
    },
    
    get: function(res){
        return this.upgrades[res].get();
    },
    
    update: function(){
        for(var key in this.upgrades){
            if(typeof this.upgrades[key].getCost !== "undefined" &&
                    this.upgrades[key].getCost()<=stats.get("energy")){
                screens.hasNew("upgrades");
            }
        }
    },
    
    draw: function(){
        for(var key in this.upgrades){
            this.upgrades[key].draw();
        }
        if (this.newBonusElem != undefined) this.newBonusElem.innerHTML = ""+stringify(calc_prestige());
        if (this.heatCount != undefined) this.heatCount.innerHTML = ""+stringify(stats.get("heat"));
    }
}