let score = localStorage.getItem('score') ? parseInt(localStorage.getItem('score')) : 0;

const clickArea = document.getElementById('clickArea');
const scoreValue = document.getElementById('scoreValue');

updateScore();

clickArea.addEventListener('click', function() {
    score++;
    updateScore();
    saveScore();
});

function updateScore() {
    scoreValue.textContent = score;
}

function saveScore() {
    localStorage.setItem('score', score);
}