const textElement = document.getElementById("text");
const input = document.getElementById("input");
const timeElement = document.getElementById("time");
const wpmElement = document.getElementById("wpm");
const accuracyElement = document.getElementById("accuracy");
const resultElement = document.getElementById("result");
const progressBar = document.getElementById("progress");

let texts = [
    "Consistency is the key to success.",
    "Practice daily to improve your typing speed.",
    "Focus on accuracy before speed.",
    "Small improvements every day lead to big results."
];

let text = "";
let time = 30;
let timer = null;
let startTime = null;

function loadText() {
    text = texts[Math.floor(Math.random() * texts.length)];
    textElement.innerHTML = "";

    text.split("").forEach((char, index) => {
        const span = document.createElement("span");
        span.innerText = char;

        if (index === 0) span.classList.add("active");

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
}

function handleTyping() {
    if (!startTime) startTime = new Date();
    if (!timer) timer = setInterval(updateTime, 1000);

    const inputText = input.value;
    const spans = textElement.querySelectorAll("span");

    let correct = 0;

    spans.forEach((span, index) => {
        const char = inputText[index];

        span.classList.remove("active");

        if (index === inputText.length) {
            span.classList.add("active");
        }

        if (char == null) {
            span.classList.remove("correct", "wrong");
        } else if (char === span.innerText) {
            span.classList.add("correct");
            span.classList.remove("wrong");
            correct++;
        } else {
            span.classList.add("wrong");
            span.classList.remove("correct");
        }
    });

    let accuracy = Math.round((correct / inputText.length) * 100) || 100;
    accuracyElement.innerText = accuracy;

    let timeElapsed = (new Date() - startTime) / 1000;
    let wpm = Math.round((inputText.length / 5) / (timeElapsed / 60));
    wpmElement.innerText = wpm || 0;
}

function updateTime() {
    time--;
    timeElement.innerText = time;

    let percent = (time / 30) * 100;
    progressBar.style.width = percent + "%";

    if (time === 0) {
        clearInterval(timer);
        showResult();
    }
}

function showResult() {
    resultElement.classList.remove("hidden");
    resultElement.innerHTML = `
        <h2>🔥 Result</h2>
        <p>WPM: ${wpmElement.innerText}</p>
        <p>Accuracy: ${accuracyElement.innerText}%</p>
        <button onclick="reset()">Retry</button>
    `;
}

function toggleTheme() {
    document.body.classList.toggle("light");
}
