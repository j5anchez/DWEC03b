document.addEventListener("DOMContentLoaded", function () {
    const gameContainer = document.getElementById("game-container");
    const scoreElement = document.getElementById("current-score");
    const bestTimeEasyElement = document.getElementById("best-time-easy");
    const bestTimeMediumElement = document.getElementById("best-time-medium");
    const bestTimeHardElement = document.getElementById("best-time-hard");
    const currentTimeElement = document.getElementById("current-time");
    const easyButton = document.getElementById("easy-button");
    const mediumButton = document.getElementById("medium-button");
    const hardButton = document.getElementById("hard-button");
    let score = 10;
    let startTime;
    let bestTimeEasy = parseFloat(localStorage.getItem("bestTimeEasy")) || "Sin registro";
    let bestTimeMedium = parseFloat(localStorage.getItem("bestTimeMedium")) || "Sin registro";
    let bestTimeHard = parseFloat(localStorage.getItem("bestTimeHard")) || "Sin registro";
    let gameInterval;
    let currentTimeInterval;
    let bubbleSize;
    function setBubbleSize(size) {
        bubbleSize = size;
    }
    function createBubble() {
        const bubble = document.createElement("div");
        bubble.className = "bubble";
        bubble.style.width = `${bubbleSize}px`;
        bubble.style.height = `${bubbleSize}px`;
        bubble.addEventListener("click", function () {
            popBubble(bubble);
        });
        gameContainer.appendChild(bubble);
        const maxX = gameContainer.clientWidth - bubble.clientWidth;
        const maxY = gameContainer.clientHeight - bubble.clientHeight;
        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);
        bubble.style.left = `${randomX}px`;
        bubble.style.top = `${randomY}px`;
    }
    function popBubble(bubble) {
        gameContainer.removeChild(bubble);
        score--;
        updateScore();
        if (score === 0) {
            endGame();
        } else {
            createBubble();
        }
    }
    function updateScore() {
        scoreElement.innerText = `${score}`;
    }
    function updateCurrentTime() {
        const currentTime = (Date.now() - startTime) / 1000;
        currentTimeElement.innerText = `${currentTime.toFixed(2)} segs`;
    }
    function startGame() {
        gameContainer.innerHTML = "";
        startTime = Date.now();
        score = 10;
        updateScore();
        updateBestTimeDisplay();
        createBubble();
        currentTimeInterval = setInterval(updateCurrentTime, 1);
    }
    function endGame() {
        clearInterval(gameInterval);
        const endTime = Date.now();
        const elapsedTime = (endTime - startTime) / 1000;
        switch (bubbleSize) {
            case 60:
                updateBestTime(elapsedTime, "bestTimeEasy", bestTimeEasy, bestTimeEasyElement);
                break;
            case 30:
                updateBestTime(elapsedTime, "bestTimeMedium", bestTimeMedium, bestTimeMediumElement);
                break;
            case 10:
                updateBestTime(elapsedTime, "bestTimeHard", bestTimeHard, bestTimeHardElement);
                break;
        }
        if (score === 0) {
            clearInterval(currentTimeInterval);
        }
    }
    function updateBestTime(elapsedTime, key, bestTime, element) {
        if (elapsedTime < bestTime || bestTime === "Sin registro") {
            bestTime = elapsedTime;
            localStorage.setItem(key, bestTime);
        }
        updateBestTimeDisplay(element, bestTime);
    }
    function updateBestTimeDisplay(element, bestTime) {
        if (element) {
            if (typeof bestTime === 'number') {
                element.innerText = `${bestTime.toFixed(2)} segs`;
            } else {
                element.innerText = `${bestTime}`;
            }
        }
    }
    function highlightButton(button) {
        easyButton.classList.remove("active");
        mediumButton.classList.remove("active");
        hardButton.classList.remove("active");
        button.classList.add("active");
    }
    easyButton.addEventListener("click", function () {
        setBubbleSize(60);
        highlightButton(easyButton);
        startGame();
    });
    mediumButton.addEventListener("click", function () {
        setBubbleSize(30);
        highlightButton(mediumButton);
        startGame();
    });
    hardButton.addEventListener("click", function () {
        setBubbleSize(10);
        highlightButton(hardButton);
        startGame();
    });
});
