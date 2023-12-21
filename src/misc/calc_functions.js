function calc_prestige() {
    //return Math.floor(Math.max(Math.log10(Math.max((stats.get("energy") - 10000) / 68500, 0)), 0)); //Math.floor(stats.get("energy")/100)/100;
    let en = stats.getAll("energy")[3];
    let correction = calc_heat_up() * calc_more_hp_reward() * calc_modern_problems_reward();
    if (en < (6.95 * Math.pow(10, 5) / correction)) return 0;
    let a = logBase((en + 10_000_000) / 7_130_000, 1.5);
    if (en >= 1.1813 * Math.pow(10, 8)) a = logBase((en - 100_000_000)/7_130_000, 1.14);
    return Math.floor(Math.max(a, 0) * correction + calc_eight_bits_of_heat_reward()) * calc_nuclear_explosion();
}

function calc_heat_up(current_h = null) {
    if (current_h == null) current_h = upgrades.get("heat_up");
    let v = current_h+1;
    if (current_h > 5 && achievements.get("Extremely Funny")) v = Math.pow(current_h - 3, 2);
    return v;
}

function calc_board_size() {
    return Math.max((stats.get("explosions")-stats.get("clicks")+200+calc_reactor_delay_reward()-calc_strong_walls()) * 0.85, 173);
}

function calc_actual_speed(current_speed = null) {
    if (current_speed == null) current_speed = upgrades.get("speed");
    return ((current_speed+5)/15) * calc_tickrate() * offline_progress_speed_up();
}

function calc_actual_explosion_time(current_expl = null) {
    if (current_expl == null) current_expl = upgrades.get("time");
    return ((current_expl+5)*12 - calc_faster_explosions()) / calc_tickrate() * offline_progress_speed_up();
}

function calc_actual_explosion_size(current_size = null) {
    if (current_size == null) current_size = upgrades.get("size");
    return (current_size+5)/10 * calc_bigger_explosion_reward();
}

function calc_upgrade_cost_growth(factor, base, currentPrice, num = 1) {
    return factor*(Math.pow(base,currentPrice)-Math.pow(base,currentPrice+num))/(1-base);
}

function calc_upgrade_cost_max(factor, base, money, currentPrice) {
    return Math.floor(Math.log(Math.pow(base,currentPrice)-money*(1-base)/factor)/Math.log(base) - currentPrice);
}

function calc_actual_multiplier(current_mult = null){
    if (current_mult == null) current_mult = upgrades.get("multiplier");
    let sV = logBase((current_mult * 1.5), 1.9);
    if (current_mult > 5) sV = logBase((current_mult - 5) * 1.9, 1.1) + 4;
    if (current_mult > 13 && achievements.get("Extremely Funny")) sV = logBase(current_mult - 12, 1.015);
    return Math.max(0, sV * calc_no_longer_needed_reward());
}

function calc_additional_balls_reward() {
    return achievements.get("All It Takes Is A Spark") ? 2 : 0;
}

function calc_reactor_delay_reward() {
    return achievements.get("Confined Space") ? -100 : 0;
}

function calc_bigger_explosion_reward() {
    return achievements.get("We Need To Go BIGGER") ? 1.1 : 1;
}

function calc_more_hp_reward() {
    return achievements.get("Speedrun") ? 2 : 1;
}

function calc_modern_problems_reward() {
    if (!achievements.get("Modern Problems Require a Lot of Energy")) return 1;
    let tm = Math.max(Math.min(calc_get_minutes_since_sacrifice(), 300), 0);
    let v = 1;

    if (tm <= 120) {
        v = Math.pow(1.009, tm);
    } else {
        v = (tm / 120) + 1.93;
    }

    return v;
}

function calc_extremely_funny_2_reward() {
    if (!achievements.get("Extremely F- wait, didn't I already unlock this achievement?")) return 1;
    let mu = Math.min(stats.get("matter"), 1000);

    return Math.pow(mu, 1.1) / 10 + 1;
}

function calc_get_hours_of_playtime() {
    return Math.floor((parseInt(Date.now()) - this.stats.time_of_beginning)/1000) / 3600;
}

function calc_get_minutes_since_sacrifice() {
    return Math.floor((parseInt(Date.now()) - this.stats.time_of_last_prestige)/1000) / 60;
}

function calc_no_longer_needed_reward() {
    return achievements.get("No Longer Needed") ? 1.1 : 1;
}

function calc_eight_bits_of_heat_reward() {
    return achievements.get("Eight Bits of Heat") ? 0.01 * calc_get_hours_of_playtime() : 0;
}

function calc_enrichment(current_enr = null) {
    if (current_enr == null) current_enr = upgrades.get("enrichment");
    let v = 0;
    /*if (current_enr <= 4)*/ v = Math.max(0, logBase((stats.get("heat")+1) * current_enr, 1.2));
    if (current_enr > 4 && achievements.get("Extremely Funny")) {
        let nV = Math.pow((stats.get("heat")+1) * (current_enr - 4)/2, 0.44);
        if (nV >= v) return nV;
        return v;
    }
    return v;
}

function calc_energy_output(group = 0) {
    return group*(1+calc_actual_multiplier()+calc_enrichment()+calc_eight_bits_of_heat_reward()*2);
}

function calc_matter_output() {
    let heat = stats.getAll("heat")[4];
    let v = logBase((heat - 794.702), 1.9)-12;
    if (achievements.get("Heavy Duty")) v = Math.pow(heat - 5000, 0.45) / 15;
    return v;
}

function calc_tickrate(current_tick = null) {
    if (current_tick == null && !upgrades.upgrades["tickspeed"]) return 1;
    if (current_tick == null) current_tick = upgrades.get("tickspeed");
    if (current_tick <= 3) return Math.pow(1.5, current_tick);
    return 0.5*(current_tick + 1) + 2;
}

function calc_nuclear_explosion(current_nucl = null) {
    if (current_nucl == null && !upgrades.upgrades["heat_matter_multiplier"]) return 1;
    if (current_nucl == null) current_nucl = upgrades.get("heat_matter_multiplier");
    return Math.pow(2, current_nucl);
}

function calc_strong_walls(current_wall = null) {
    if (current_wall == null && !upgrades.upgrades["stronger_walls"]) return 0;
    if (current_wall == null) current_wall = upgrades.get("stronger_walls");
    return current_wall*200;
}

function calc_faster_explosions(current_expl = null) {
    if (current_expl == null && !upgrades.upgrades["faster_explosions"]) return 0;
    if (current_expl == null) current_expl = upgrades.get("faster_explosions");
    return current_expl * 30;
}

function calc_this_reaction_lifetime() {
    return (parseInt(Date.now()) - stats.time_of_last_reactor)/1000;
}

function calc_meltdown_output() {
    return calc_energy_output(stats.getAll("chain")[3])*100*calc_tickrate() * calc_extremely_funny_2_reward() * offline_progress_speed_up();
}

function offline_progress_speed_up() {
    return offlineProgressOn && rapidOfflineProgress ? 10 : 1;
}