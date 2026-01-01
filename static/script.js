const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatWindow = document.getElementById("chat-window");
const clearBtn = document.getElementById("clear-btn");

// Add message to chat window
function addMessage(text, sender, typing = false) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender);

    const textDiv = document.createElement("div");
    textDiv.classList.add("text");
    
    if (typing) {
        textDiv.textContent = ""; // Will animate text later
    } else {
        textDiv.textContent = text;
    }

    const timeDiv = document.createElement("div");
    timeDiv.classList.add("time");
    const now = new Date();
    timeDiv.textContent = now.getHours() + ":" + String(now.getMinutes()).padStart(2, '0');

    messageDiv.appendChild(textDiv);
    messageDiv.appendChild(timeDiv);
    chatWindow.appendChild(messageDiv);

    chatWindow.scrollTop = chatWindow.scrollHeight;

    return textDiv; // Return div for typing animation
}

// Typing animation function
function typeText(element, text, callback) {
    let i = 0;
    const interval = setInterval(() => {
        element.textContent += text.charAt(i);
        i++;
        if (i >= text.length) {
            clearInterval(interval);
            if (callback) callback();
        }
        chatWindow.scrollTop = chatWindow.scrollHeight; // auto scroll
    }, 20); // typing speed in ms
}

// Send message to Flask backend
function sendMessage() {
    const text = userInput.value.trim();
    if (text === "") return;
    addMessage(text, "user");
    userInput.value = "";

    // Add temporary bot typing bubble
    const botDiv = addMessage("", "bot", true);

    fetch("/get?msg=" + encodeURIComponent(text))
        .then(response => response.json())
        .then(data => {
            // Animate bot typing
            typeText(botDiv, data.reply);
        })
        .catch(() => {
            botDiv.textContent = "Error! Could not reach server.";
        });
}

// Event listeners
sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
});

clearBtn.addEventListener("click", () => {
    chatWindow.innerHTML = "";
});
