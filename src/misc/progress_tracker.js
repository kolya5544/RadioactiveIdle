var progressText = null;
var progressBar = null;
var currentProgressStage = 0;

function trackProgress() {
    if (progressText == null || progressBar == null) {
        progressText = document.getElementById("progressText");
        progressBar = document.getElementById("progressBar");
        return;
    }

    // first stage - unlocking Sacrifice
    if (!isSacrificeUnlocked() || stats.getAll("heat")[2] < 1) {
        stage = 1;
    } else if (!doesHaveMeltdownBought()) {
        stage = 2;
    } else {
        stage = 3;
    }

    if (currentProgressStage == stage) {
        currentProgressStage = stage;
        update_progress_value();
        return;
    } else {
        currentProgressStage = stage;
    }

    update_progress_text();
    update_progress_value();
}

function update_progress_value() {
    let perc = 0;

    if (stage == 1) {
        perc = logBase((stats.getAll("energy")[3] + 139000) / 139000, 5) * (Math.log(5) / Math.log(6));
        if (perc >= 1) showPrestige();
    } else if (stage == 2) {
        perc = logBase((stats.getAll("heat")[0] + 100) / 100, 5) * (Math.log(5) / Math.log(11));
        //if (perc >= 1) allowMeltdown();
    } else if (stage == 3) {
        if (stats.get("heat") <= 5000) {
            perc = logBase(stats.get("heat") / 1000, 10) * (Math.log(10) / Math.log(5));
        } else {
            let v = calc_matter_output();
            let nextV = v - Math.floor(v);
            perc = nextV;
        }
    }

    perc = Math.min(Math.max(perc, 0), 1);

    progressBar.innerText = `${stringify(perc * 100)}%`;
    progressBar.style.width = `${perc * 100}%`;
}

function update_progress_text() {
    switch (stage) {
        case 1:
            progressText.innerText = "Progress to unlocking Sacrifice:";
            break;
        case 2:
            progressText.innerText = "Progress to meltdown:";
            break;
        case 3:
            progressText.innerText = "Progress to next Matter Unit:";
            break;
        default:
            break;
    }
}

function isSacrificeUnlocked() {
    return stats.getAll("heat")[2] > 0 || stats.getAll("energy")[3] >= 6.95*Math.pow(10, 5);
}

function doesHaveMeltdownBought() {
    return upgrades.get("meltdown") > 0;
}

function checkCanMatter() {
    return upgrades.get("meltdown") > 0 && Math.floor(calc_matter_output()) > 0;
}