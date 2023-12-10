function calc_prestige() {
    //return Math.floor(Math.max(Math.log10(Math.max((stats.get("energy") - 10000) / 68500, 0)), 0)); //Math.floor(stats.get("energy")/100)/100;
    return Math.floor(Math.max(logBase((stats.getAll("energy")[3] + 10000000) / 7130000, 1.5), 0));
}

function calc_board_size() {
    return Math.max((stats.get("explosions")-stats.get("clicks")+200+calc_reactor_delay()) * 0.85, 173);
}

function calc_actual_speed(current_speed = null) {
    if (current_speed == null) current_speed = upgrades.get("speed");
    return ((current_speed+5)/15);
}

function calc_actual_explosion_time(current_expl = null) {
    if (current_expl == null) current_expl = upgrades.get("time");
    return (current_expl+5)*12;
}

function calc_actual_explosion_size(current_size = null) {
    if (current_size == null) current_size = upgrades.get("size");
    return (current_size+5)/10;
}

function calc_upgrade_cost_growth(factor, base, currentPrice, num = 1) {
    return factor*(Math.pow(base,currentPrice)-Math.pow(base,currentPrice+num))/(1-base);
}

function calc_upgrade_cost_max(factor, base, money, currentPrice) {
    return Math.floor(Math.log(Math.pow(base,currentPrice)-money*(1-base)/factor)/Math.log(base) - currentPrice);
}

function calc_actual_multiplier(current_mult = null){
    if (current_mult == null) current_mult = upgrades.get("multiplier");
    return Math.max(0, logBase((current_mult * 1.5), 1.9));
}

function calc_additional_balls() {
    return achievements.get("All It Takes Is A Spark") ? 2 : 0;
}

function calc_reactor_delay() {
    return achievements.get("Confined Space") ? -100 : 0;
}

function calc_enrichment(current_enr = null) {
    if (current_enr == null) current_enr = upgrades.get("enrichment");
    return Math.max(0, logBase((stats.get("heat")+1) * current_enr, 1.2));
}