const textElement = document.getElementById("text");
const input = document.getElementById("input");
const timeElement = document.getElementById("time");
const wpmElement = document.getElementById("wpm");
const accuracyElement = document.getElementById("accuracy");
const resultElement = document.getElementById("result");

let texts = [
    "The quick brown fox jumps over the lazy dog.",
    "Practice daily to improve your typing speed.",
    "Consistency is the key to success.",
    "Typing fast requires focus and accuracy."
];

let text = "";
let time = 30;
let timer = null;
let startTime = null;
let score = 0;
let streak = 0;
let maxStreak = 0;
let combo = 1;

function getRandomText() {
    return texts[Math.floor(Math.random() * texts.length)];
}

function loadText() {
    text = getRandomText();
    textElement.innerHTML = "";
    text.split("").forEach(char => {
        const span = document.createElement("span");
        span.innerText = char;
        textElement.appendChild(span);
    });
}

loadText();

function setTime(t) {
    time = t;
    timeElement.innerText = time;
    reset();
}

function reset() {
    clearInterval(timer);
    timer = null;
    startTime = null;
    input.value = "";
    resultElement.classList.add("hidden");
    loadText();
    wpmElement.innerText = 0;
    accuracyElement.innerText = 100;
    streak = 0;
    maxStreak = 0;
    combo = 1;
}

function handleTyping() {
    if (!startTime) startTime = new Date();
    if (!timer) timer = setInterval(updateTime, 1000);

    const inputText = input.value;
    const spans = textElement.querySelectorAll("span");

    let correct = 0;

    spans.forEach((span, index) => {
        const char = inputText[index];

        if (char == null) {
            span.classList.remove("correct", "wrong");
        } else if (char === span.innerText) {
            span.classList.add("correct");
            span.classList.remove("wrong");
            correct++;

            streak++;
            combo = Math.floor(streak / 5) + 1;
            maxStreak = Math.max(maxStreak, streak);

        } else {
            span.classList.add("wrong");
            span.classList.remove("correct");

            streak = 0;
            combo = 1;
        }
    });

    let accuracy = Math.round((correct / inputText.length) * 100) || 100;
    accuracyElement.innerText = accuracy;

    let timeElapsed = (new Date() - startTime) / 1000;
    let wpm = Math.round((inputText.length / 5) / (timeElapsed / 60));
    wpmElement.innerText = wpm || 0;

    score = Math.floor(wpm * (accuracy / 100) * combo);
}

function updateTime() {
    time--;
    timeElement.innerText = time;

    if (time === 0) {
        clearInterval(timer);
        showResult();
    }
}

function showResult() {
    let best = localStorage.getItem("bestScore") || 0;

    if (score > best) {
        localStorage.setItem("bestScore", score);
        best = score;
    }

    resultElement.classList.remove("hidden");
    resultElement.innerHTML = `
        <h2>Result</h2>
        <p>WPM: ${wpmElement.innerText}</p>
        <p>Accuracy: ${accuracyElement.innerText}%</p>
        <p>Score: ${score}</p>
        <p>🔥 Max Streak: ${maxStreak}</p>
        <p>⚡ Combo: x${combo}</p>
        <p>🏆 Best: ${best}</p>
    `;
}

function toggleTheme() {
    document.body.classList.toggle("light");
}

function setTheme(theme) {
    document.body.className = theme;
}

function shareScore() {
    let text = `I scored ${wpmElement.innerText} WPM with ${accuracyElement.innerText}% accuracy 🔥`;
    navigator.clipboard.writeText(text);
    alert("Copied! Share it 😎");
}

function takeScreenshot() {
    html2canvas(document.querySelector(".container")).then(canvas => {
        let link = document.createElement("a");
        link.download = "score.png";
        link.href = canvas.toDataURL();
        link.click();
    });
}

function saveUser() {
    let name = document.getElementById("username").value;
    localStorage.setItem("user", name);
    alert("Saved!");
}