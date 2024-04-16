// ############################################################################################
// #####################################   Variable   #########################################
// ############################################################################################


let score = localStorage.getItem('score') ? parseInt(localStorage.getItem('score')) : 0;
let autoClickers = localStorage.getItem('autoClickers') ? parseInt(localStorage.getItem('autoClickers')) : 0;
let clickMultiplier = localStorage.getItem('clickMultiplier') ? parseInt(localStorage.getItem('clickMultiplier')) : 1;
let clicks = localStorage.getItem('clicks') ? parseInt(localStorage.getItem('clicks')) : 1;
let autoClickerValue = 1;
let autoClickInterval;

let autoClickerBasePrice = 10;
let clickMultiplierBasePrice = 50;
let autoClickerPriceMultiplier = 1.2;
let clickMultiplierPriceMultiplier = 1.5;

const clickArea = document.getElementById('clickArea');
const scoreValue = document.getElementById('scoreValue');
const autoClickersValue = document.getElementById('autoClickersValue');
const clickMultiplierValue = document.getElementById('clickMultiplierValue');

updateScore();
updateAutoClickers();
updateClickMultiplier();


// ############################################################################################
// #####################################   Gameplay   #########################################
// ############################################################################################


clickArea.addEventListener('click', function() {
    score += clickMultiplier;
    clicks++;
    updateGoalList();
    updateScore();
    saveScore();
    checkGoals(score, clicks); // Vérifier les objectifs après chaque clic
});

function updateScore() {
    scoreValue.textContent = score;
}

function updateAutoClickers() {
    autoClickersValue.textContent = autoClickers;
}

function updateClickMultiplier() {
    clickMultiplierValue.textContent = clickMultiplier;
}

function saveScore() {
    localStorage.setItem('score', score);
    localStorage.setItem('clicks', clicks);
}

function updateButtonPrices() {
    let autoClickerPrice = Math.floor(autoClickerBasePrice * Math.pow(autoClickerPriceMultiplier, autoClickers));
    let clickMultiplierPrice = Math.floor(clickMultiplierBasePrice * Math.pow(clickMultiplierPriceMultiplier, clickMultiplier - 1));
    document.getElementById('autoClickerButton').textContent = `Auto Clicker (${autoClickerPrice} points)`;
    document.getElementById('clickMultiplierButton').textContent = `Multiplier (${clickMultiplierPrice} points)`;
}

function buyAutoClicker() {
    let price = Math.floor(autoClickerBasePrice * Math.pow(autoClickerPriceMultiplier, autoClickers));
    if (score >= price) {
        updateGoalList();
        score -= price;
        autoClickers++;
        updateScore();
        updateAutoClickers();
        saveScore();
        localStorage.setItem('autoClickers', autoClickers);
        clearInterval(autoClickInterval);
        autoClickInterval = setInterval(autoClick, 2000);
        updateButtonPrices();
    } else {
        alert('Vous n\'avez pas assez de points !');
    }
}

function autoClick() {
    score += autoClickers * autoClickerValue;
    updateGoalList();
    updateScore();
    saveScore();
}

function buyClickMultiplier() {
    let price = Math.floor(clickMultiplierBasePrice * Math.pow(clickMultiplierPriceMultiplier, clickMultiplier - 1));
    if (score >= price) {
        updateGoalList();
        score -= price;
        clickMultiplier++;
        autoClickerValue *= 2;
        updateScore();
        updateClickMultiplier();
        saveScore();
        localStorage.setItem('clickMultiplier', clickMultiplier);
        updateButtonPrices();
    } else {
        alert('Vous n\'avez pas assez de points !');
    }
}

updateButtonPrices();


// ############################################################################################
// ######################################   Windows   #########################################
// ############################################################################################


window.onload = function() {
    score = parseInt(localStorage.getItem('score')) || 0;

    updateScore();
    updateAutoClickers();
    updateClickMultiplier();
    updateButtonPrices();
    updateGoalList();
    
    if (autoClickers > 0) {
        autoClickInterval = setInterval(autoClick, 2000);
    }
}



// ############################################################################################
// ######################################   Restart   #########################################
// ############################################################################################


function clearGoalsLocalStorage() {
    localStorage.removeItem('goals');
}

// Fonction pour redémarrer le jeu
function resetGame() {
    score = 0;
    autoClickers = 0;
    clickMultiplier = 1;
    autoClickerValue = 1;
    updateScore();
    updateAutoClickers();
    updateClickMultiplier();
    saveScore();
    clearInterval(autoClickInterval); // Arrêter le timer des points
    localStorage.removeItem('autoClickers');
    localStorage.removeItem('clickMultiplier');
    clicks = 0;
    goals.forEach(goal => {
        goal.completed = false; // Réinitialiser l'état des objectifs
    });
    updateScore();
    updateGoalList();
    clearGoalsLocalStorage(); // Effacer les objectifs du stockage local
}



// ############################################################################################
// ####################################   Objectifs   #########################################
// ############################################################################################


// Définition des objectifs, y compris les anciens objectifs
let goals = JSON.parse(localStorage.getItem('goals')) || [
    { description: "Atteindre un score de 100 points", target: 100, reward: 50, completed: false },
    { description: "Atteindre un score de 500 points", target: 500, reward: 300, completed: false },
    { description: "Atteindre un score de 1000 points", target: 1000, reward: 500, completed: false },
    { description: "Atteindre un score de 50000 points", target: 50000, reward: 1500, completed: false },
    { description: "Atteindre un score de 1000000 points", target: 1000000, reward: 2000, completed: false },
    { description: "Atteindre un score de 20000000 points", target: 20000000, reward: 5000, completed: false },
    { description: "Cliquez 5 fois", objClick: 5, reward: 50, completed: false },
    { description: "Cliquez 200 fois", objClick: 200, reward: 200, completed: false },
    { description: "Cliquez 1000 fois", objClick: 1000, reward: 1000, completed: false },
    { description: "Cliquez 2000 fois", objClick: 2000, reward: 1500, completed: false }
];

// Fonction pour mettre à jour les objectifs dans le stockage local
function updateGoalsLocalStorage() {
    localStorage.setItem('goals', JSON.stringify(goals));
}

// Fonction pour vérifier si un objectif est accompli
function checkGoals(score, clicks) {
    goals.forEach(goal => {
        if (!goal.completed && goal.target <= score) {
            goal.completed = true;
            rewardPlayer(goal.reward);
            updateGoalsLocalStorage(); // Mettre à jour les objectifs dans le stockage local
            updateGoalList();
        }

        if (!goal.completed && goal.objClick <= clicks) {
            goal.completed = true;
            rewardPlayer(goal.reward);
            updateGoalsLocalStorage(); // Mettre à jour les objectifs dans le stockage local
            updateGoalList();
        }
    });
}


// Fonction pour récompenser le joueur
function rewardPlayer(points) {
    score += points;
    updateScore();
}

function updateGoalList() {
    const goalsContainer = document.getElementById('goals-container');
    goalsContainer.innerHTML = ""; // Effacer le contenu actuel du conteneur

    goals.forEach((goal, index) => {
        // Créer un élément li pour l'objectif
        const goalItem = document.createElement('li');
        goalItem.innerHTML = `${goal.description} - <strong>${goal.completed ? "Accompli" : "En cours"}</strong>`;
        goalsContainer.appendChild(goalItem); // Ajouter l'élément li à la liste d'objectifs

        // Créer un conteneur pour la barre de progression
        const progressBarContainer = document.createElement('div');
        progressBarContainer.classList.add('progress-bar-container');

        // Créer la barre de progression
        const progressBar = document.createElement('div');
        progressBar.classList.add('progress-bar');
        const progress = document.createElement('div');
        progress.classList.add('progress');

        if (goal.objClick) { // Vérifiez si l'objectif est lié au nombre de clics
            progress.style.width = (clicks >= goal.objClick ? '100%' : `${(clicks / goal.objClick) * 100}%`);
            if (clicks >= goal.objClick) {
                progress.classList.add('goal-progress');
            }
        } else { // Si ce n'est pas un objectif de clic, utilisez le score
            progress.style.width = (score >= goal.target ? '100%' : `${(score / goal.target) * 100}%`);
            if (score >= goal.target) {
                progress.classList.add('goal-progress');
            }
        }

        progressBar.appendChild(progress);
        progressBarContainer.appendChild(progressBar);

        // Ajouter la barre de progression au conteneur
        goalsContainer.appendChild(progressBarContainer);
    });
}

