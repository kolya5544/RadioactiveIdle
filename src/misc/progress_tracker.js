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
    if (!isSacrificeUnlocked() || stats.get("heat") < 1) {
        stage = 1;
    } else {
        stage = 2;
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
        perc = logBase((stats.get("energy") + 139000) / 139000, 5) * (Math.log(5) / Math.log(6));
        if (perc >= 1) showPrestige();
    } else if (stage == 2) {
        perc = 0;
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
        default:
            break;
    }
}

function isSacrificeUnlocked() {
    return stats.get("heat") > 0 || stats.get("energy") >= 6.95*Math.pow(10, 5);
}