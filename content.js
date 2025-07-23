console.log("[YT Live Chat Overlay] Loaded");

let chatOverlayVisible = false;
let toggleButton = null;
let originalChatContainer = null;
let chatOverlay = null;

function createChatOverlay() {
    if (chatOverlayVisible) return;

    const videoId = new URLSearchParams(window.location.search).get("v");
    if (!videoId) {
        console.log("No video ID found in URL");
        return;
    }

    // Create the chat overlay container
    chatOverlay = document.createElement("div");
    chatOverlay.id = "yt-live-chat-overlay";

    Object.assign(chatOverlay.style, {
        position: "fixed",
        bottom: "20px",
        left: "20px",
        width: "400px",
        height: "60%",
        maxHeight: "600px",
        zIndex: "9998",
        borderRadius: "12px",
        overflow: "hidden",
        backgroundColor: "transparent",
        pointerEvents: "auto",
    });

    // Create new iframe for chat overlay using the YouTube live chat embed URL
    const chatIframe = document.createElement("iframe");
    chatIframe.src = `https://www.youtube.com/live_chat?v=${videoId}&embed_domain=${location.hostname}`;
    Object.assign(chatIframe.style, {
        width: "100%",
        height: "100%",
        border: "none",
        backgroundColor: "transparent",
    });

    chatOverlay.appendChild(chatIframe);

    // Optional: fade overlay at the top
    const fadeTop = document.createElement("div");
    Object.assign(fadeTop.style, {
        position: "absolute",
        top: "0",
        left: "0",
        right: "0",
        height: "40px",
        background: "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)",
        zIndex: "2",
        pointerEvents: "none"
    });
    chatOverlay.appendChild(fadeTop);

    document.body.appendChild(chatOverlay);
    chatOverlayVisible = true;
    console.log("Overlay with embedded chat iframe created.");
}

function removeChatOverlay() {
    if (!chatOverlayVisible || !chatOverlay) return;

    chatOverlay.remove();
    chatOverlay = null;
    chatOverlayVisible = false;
    console.log("Overlay removed.");
}


function toggleOverlay() {
    if (chatOverlayVisible) {
        removeChatOverlay();
        updateButtonText("💬 Show Chat");
    } else {
        createChatOverlay();
        updateButtonText("❌ Hide Chat");
    }
}

// ... (rest of the code remains same as previous implementation)

function updateButtonText(text) {
    if (toggleButton) toggleButton.textContent = text;
}

function createToggleButton() {
    if (toggleButton) return;

    toggleButton = document.createElement("button");
    toggleButton.id = "yt-chat-toggle-btn";
    toggleButton.textContent = "💬 Show Chat";
    toggleButton.onclick = toggleOverlay;
    toggleButton.style.cssText = `
        position: fixed;
        bottom: 70px;
        right: 20px;
        z-index: 9999;
        background: rgba(255, 0, 0, 0.8);
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        transition: all 0.2s;
    `;

    toggleButton.addEventListener('mouseover', () => {
        toggleButton.style.background = "rgba(255, 0, 0, 1)";
    });

    toggleButton.addEventListener('mouseout', () => {
        toggleButton.style.background = "rgba(255, 0, 0, 0.8)";
    });

    document.body.appendChild(toggleButton);
}

function handleFullscreenChange() {
    const isFull = !!document.fullscreenElement;

    if (isFull) {
        createToggleButton();
        toggleButton.style.display = "block";
    } else {
        if (toggleButton) toggleButton.style.display = "none";
        removeChatOverlay();
        updateButtonText("💬 Show Chat");
    }
}


// Set up event listeners
['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange'].forEach(event => {
    document.addEventListener(event, handleFullscreenChange);
});

// Initialize
function init() {
    if (!!document.fullscreenElement) {
        createToggleButton();
    }
}

// Start with delay to allow YouTube to load
setTimeout(init, 1000);