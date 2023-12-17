function check_new_beginnings() {
    return stats.get("energy") > 0;
}

function check_chain_reaction() {
    return stats.getAll("chain")[0] > 2000;
}

function check_reactor_incremental() {
    return stats.get("heat") > 0;
}

function check_all_it_takes_is_a_spark() {
    return upgrades.get("multiplier") >= 5;
}

function check_confined_space() {
    return stats.getAll("explosions")[1] >= 50000;
}

function check_nine_circles_of_hell() {
    return stats.getAll("sacrifices")[1] >= 9;
}

function check_cookie_clicker() {
    return stats.getAll("clicks")[1] >= 1000;
}

function check_dont_you_have_something_better_to_do() {
    return stats != null ? (((Date.now() - stats.time_of_beginning) / 1000) >= 3600*4) : false;
}

function check_positively_charged() {
    return stats.getAll("energy")[1] >= 1_000_000_000;
}

function check_the_instigator() {
    return stats.get("energy") > 200_000_000 && stats.get("clicks") <= 2;
}

function check_speedrun() {
    return calc_prestige() >= 1 && stats.get("explosions") <= 100;
}

function check_the_burning_souls() {
    return stats.getAll("heat")[1] >= 666;
}

function check_modern_problems() {
    return stats.get("energy") >= 100_000_000_000;
}

function check_minor_inconvenience() {
    return upgrades.get("meltdown") > 0 && upgrades.get("time") > 50;
}

function check_one_achievement_to_rule_them_all() {
    let cnt = 0;
    let vLen = Object.keys(achievements.achievements);
    vLen.forEach((z) => cnt += achievements.get(z) ? 1 : 0);
    return cnt == vLen.length - 1;
}

function check_extremely_funny() {
    return stats.getAll("heat")[4] >= 69420;
}

function check_mvp() {
    return calc_meltdown_output() > 1_000_000_000;
}

function check_heavy_duty() {
    return stats.getAll("matter")[1] >= 24;
}