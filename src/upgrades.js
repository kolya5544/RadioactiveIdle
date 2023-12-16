function initUpgrades(){
    upgrades.addUpgrade("size", 0, "Bigger Explosions").cost(10, 1.1).button([1, 0]);
    upgrades.addUpgrade("time", 0, "Longer Explosions").cost(10, 1.1).button([1, 0]);
    upgrades.addUpgrade("speed", 0, "Faster Atoms").cost(10, 1.1).button([1, 0]);
    upgrades.addUpgrade("balls", 0, "Extra Atoms").cost(50, 1.1).button([1, 0]);
};

function initHeatUpgrades() {
    upgrades.addUpgrade("multiplier", 0, "Energy Multiplier", "heat", "Get more energy per each explosion").cost(1, 2).button([1, 0]);
    upgrades.addUpgrade("enrichment", 0, "Enriched Atoms", "heat", "Get more energy the more Heat Points you currently have.", 16).cost(48, 4).button([1, 0]);
    upgrades.addUpgrade("heat_up", 0, "Efficient Extraction", "heat", "Increase the amount of Heat Points you get on Sacrifice.", 128).cost(200, 3).button([1, 0]);
    upgrades.addUpgrade("meltdown", 0, "Meltdown", "heat", "Passively generate x100 this run's best chain reaction output every second. Starts an uncontrollable chain reaction, consuming everything on its way.", 1000, meltdown_allow_once, meltdown_buy_max).cost(1000, 1).button([1, 0]);
}

function initMatterUpgrades() {
    upgrades.addUpgrade("tickspeed", 0, "Particle Accelerator", "matter", "All processes in the game happen at a faster rate").cost(2, 2).button([1, 0]);
    upgrades.addUpgrade("heat_matter_multiplier", 0, "Nuclear Explosion", "matter", "Double Heat Point gain on Sacrifice").cost(2, 2).button([1, 0]);
    upgrades.addUpgrade("stronger_walls", 0, "Stronger Walls", "matter", "Reactor size increase starts significantly later").cost(1, 2).button([1, 0]);
    upgrades.addUpgrade("faster_explosions", 0, "External Intake", "matter", "Explosions last for *less* time", 0, faster_explosions_allow_once, faster_explosions_buy_max).cost(10, 2).button([1, 0]);
    upgrades.addUpgrade("controllable_meltdown", 0, "Rapid Decay", "matter", "Start every game with 128 Heat Points and Sacrifice unlocked", 0, controllable_meltdown_allow_once, controllable_meltdown_buy_max).cost(25, 2).button([1, 0]);
    upgrades.addUpgrade("heat_generator", 0, "Heat Control System", "matter", "Generate 1/15th of current Sacrifice reward per minute (affected by tickrate)", 0, hcs_allow_once, hcs_buy_max).cost(50, 2).button([1, 0]);
}

function meltdown_allow_once(factor, base, current, number) {
    if (doesHaveMeltdownBought()) return -1;
    return 1000;
}

function meltdown_buy_max(factor, base, money, current) {
    if (doesHaveMeltdownBought()) return 0;
    return (money >= 1000) ? 1 : 0;
}

function controllable_meltdown_allow_once(factor, base, current, number) {
    if (doesHaveRapidDecayBought()) return -1;
    return 25;
}

function controllable_meltdown_buy_max(factor, base, money, current) {
    if (doesHaveRapidDecayBought()) return 0;
    return (money >= 25) ? 1 : 0;
}

function faster_explosions_allow_once(factor, base, current, number) {
    if (upgrades.get("faster_explosions") > 0) return -1;
    return 10;
}

function faster_explosions_buy_max(factor, base, money, current) {
    if (upgrades.get("faster_explosions") > 0) return 0;
    return (money >= 20) ? 1 : 0;
}

function hcs_buy_max(factor, base, money, current) {
    if (upgrades.get("heat_generator") > 0) return 0;
    return (money >= 50) ? 1 : 0;
}

function hcs_allow_once(factor, base, current, number) {
    if (upgrades.get("heat_generator") > 0) return -1;
    return 50;
}

function Upgrade(res, elem, decimal, displayName, currency="energy", description = null, currency_requirement = null, costGrowthFunction = calc_upgrade_cost_growth, maxBuyFunction = calc_upgrade_cost_max){
    this.res = res;
    this.value = 0;
    this.exponent = decimal;
    this.decimal = Math.pow(10, decimal);
    this.tableElem = elem;
    this.displayName = displayName;
    this.currency = currency;
    this.costGrowthFunction = costGrowthFunction;
    this.maxBuyFunction = maxBuyFunction;
    this.description = description;
    this.currency_requirement = currency_requirement;
};

Upgrade.prototype = {
    cost: function(factor, base){
        this.getCost = function(num){
            if(typeof num === "undefined"){
                num = 1;
            }
            return this.costGrowthFunction(factor, base, this.get(), num);
        }
        this.getMaxBuy = function(money){
            return this.maxBuyFunction(factor, base, money, this.get());
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
        return stats.get(this.currency) >= this.getCost(amount);
    },
    
    buy: function(amount){
        if(amount <= 0){
            var amount = this.getMaxBuy(stats.get(this.currency))
        }
        var cost = this.getCost(amount)
        if(stats.get(this.currency) >= cost && cost != -1){
            if (amount >= 50 && this.res == "size") { // we need to go bigger achievement check
                achievements.setCompletion("We Need To Go BIGGER", true, true);
            }

            if (this.res == "enrichment") { // rich boi achievement check
                achievements.setCompletion("Rich Boi", true, true);
            }

            if (this.res == "meltdown") { // chernobyl disaster achievement check
                if (!stats.gotMeltdownBefore) flash();

                achievements.setCompletion("Chernobyl Disaster", true, true);
                stats.gotMeltdownBefore = true;
            }

            if (this.res == "tickspeed") { // "Faster Than Light" achievement check
                achievements.setCompletion("Faster Than Light", true, true);
            }

            stats.add(this.currency, -cost);
            this.add(amount);
        }

        if (upgrades.get("tickspeed") > 0 && upgrades.get("heat_matter_multiplier") > 0 && upgrades.get("stronger_walls") > 0 && upgrades.get("faster_explosions") > 0 && upgrades.get("controllable_meltdown") > 0 && upgrades.get("heat_generator") > 0) { // "Buffed Up" achievement check
            achievements.setCompletion("Buffed Up", true, true);
        }

        if (upgrades.get("time") > 0 && upgrades.get("faster_explosions") > 0) { // "Actual Insanity" achievement check
            achievements.setCompletion("Actual Insanity", true, true);
        }

        this.updateSubtext();
    },
    
    draw: function(){
        let valueElem = this.tableElem.children[1];

        if (this.getCost() == -1) {
            this.tableElem.children[2].style.visibility = "hidden";
            this.tableElem.children[3].style.visibility = "hidden";
            this.tableElem.children[4].style.visibility = "hidden";
        } else {
            this.tableElem.children[2].style.visibility = "";
            this.tableElem.children[3].style.visibility = "";
            this.tableElem.children[4].style.visibility = "";
        }

        valueElem.innerHTML = ""+stringify(this.get());
        if(typeof this.getCost !== "undefined"){
            var cost = this.getCost();
            this.costElem.innerHTML = " "+stringify(cost);
            if(stats.get(this.currency) >= cost && cost != -1){
                this.buttonElems[0].className = "button active"
                this.buttonElems[1].className = "button active"
            }else{
                this.buttonElems[0].className = "button inactive"
                this.buttonElems[1].className = "button inactive"
            }
            if (this.currency_requirement != null) {
                visible = stats.getAll(this.currency)[2] >= this.currency_requirement;
                this.tableElem.style.display = visible ? "" : "none";
            }
        }
        this.updateSubtext();
    },

    updateSubtext: function(){
        let subtextEl = this.tableElem.children[5];
        var suffix = "";
        var prefix = "";
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
            case "multiplier":
                prev = calc_actual_multiplier(this.value) + 1;
                next = calc_actual_multiplier(this.value + 1) + 1;
                break;
            case "heat_up":
                prev = calc_heat_up(this.value);
                next = calc_heat_up(this.value + 1);
                prefix = "x";
                break;
            case "enrichment":
                prev = calc_enrichment(this.value);
                next = calc_enrichment(this.value + 1);
                break;
            case "tickspeed":
                prev = calc_tickrate(this.value) * 60;
                next = calc_tickrate(this.value + 1) * 60;
                suffix = " ticks/second";
                break;
            case "heat_matter_multiplier":
                prev = calc_nuclear_explosion(this.value);
                next = calc_nuclear_explosion(this.value + 1);
                prefix = "x";
                break;
            case "stronger_walls":
                prev = calc_strong_walls(this.value);
                next = calc_strong_walls(this.value + 1);
                break;
            case "faster_explosions":
                prev = calc_faster_explosions(this.value) / 60;
                next = calc_faster_explosions(this.value + 1) / 60;
                prefix = "-";
                suffix = "s";
                break;
        }

        if (prev == -1 || next == -1) { subtextEl.style.display = "none"; return; }
        prev = Math.floor(prev * 100) / 100;
        next = Math.floor(next * 100) / 100;

        subtextEl.innerText = `(${prefix}${prev}${suffix} → ${prefix}${next}${suffix})`;
    }
};

function Upgrades(){
    this.upgrades = {};
    this.newBonusElem = undefined;
    this.heatCount = undefined;
    this.newMatterElem = undefined;
    this.matterCount = undefined;
    this.energyCount = undefined;
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
    
    reset: function(hard_reset = false, matter_reset = false){
        for(var res in this.upgrades){
            if (this.upgrades[res].currency == "heat" && (!hard_reset && !matter_reset)) continue;
            if (this.upgrades[res].currency == "matter" && !hard_reset) continue;
            this.set(res, 0);
        }
    },
    
    addUpgrade: function(res, decimal, displayName = "Basic Upgrade", currency = "energy", description = null, currency_requirement = null, costGrowthFunction = calc_upgrade_cost_growth, maxBuyFunction = calc_upgrade_cost_max){
        this.upgrades[res] = new Upgrade(res, null, decimal, displayName, currency, description, currency_requirement, costGrowthFunction, maxBuyFunction);

        // render new upgrade
        if (currency == "energy") this.upgrades[res].tableElem = renderUpgrade(res, displayName);
        if (currency == "heat") this.upgrades[res].tableElem = renderHeatUpgrade(this.upgrades[res]);
        if (currency == "matter") this.upgrades[res].tableElem = renderMatterUpgrade(this.upgrades[res]);
        elem = document.getElementById(res);

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
                    this.upgrades[key].getCost()<=stats.get(this.upgrades[key].currency)){
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

        if (this.newMatterElem != undefined) this.newMatterElem.innerHTML = ""+stringify(Math.floor(calc_matter_output()));
        if (this.matterCount != undefined) this.matterCount.innerHTML = ""+stringify(stats.get("matter"));

        if (this.energyCount != undefined) this.energyCount.innerHTML = ""+stringify(stats.get("energy"));
    }
}