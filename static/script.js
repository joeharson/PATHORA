let currentThreadId = localStorage.getItem("pathora_thread_id") || null;
let latestAnswerMarkdown = "";

const $ = (selector) => document.querySelector(selector);

function setPrompt(text) {
    const input = $("#userInput");
    input.value = text;
    updateCharacterCount();
    input.focus();
}

function updateCharacterCount() {
    const input = $("#userInput");
    const counter = $("#charCount");
    if (input && counter) counter.textContent = `${input.value.length} / ${input.maxLength}`;
}

function setLoading(isLoading) {
    const sendBtn = $("#sendBtn");
    const btnText = $("#btnText");
    const btnLoader = $("#btnLoader");

    sendBtn.disabled = isLoading;
    btnText.classList.toggle("hidden", isLoading);
    btnLoader.classList.toggle("hidden", !isLoading);
    sendBtn.setAttribute("aria-busy", String(isLoading));
}

function showError(message) {
    const errorBox = $("#errorBox");
    errorBox.textContent = message;
    errorBox.classList.remove("hidden");
}

function hideError() {
    const errorBox = $("#errorBox");
    errorBox.classList.add("hidden");
    errorBox.textContent = "";
}

function showResult(answer, threadId) {
    latestAnswerMarkdown = answer;

    const resultBox = $("#resultBox");
    const resultSection = $("#resultSection");
    const threadInfo = $("#threadInfo");

    if (typeof marked !== "undefined") {
        resultBox.innerHTML = marked.parse(answer);
    } else {
        resultBox.textContent = answer;
    }

    threadInfo.textContent = `PATHORA journey · ${threadId}`;
    resultSection.classList.remove("hidden");
    resultSection.classList.add("reveal");

    requestAnimationFrame(() => {
        resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });
}

async function sendMessage() {
    hideError();

    const input = $("#userInput");
    const message = input.value.trim();

    if (!message) {
        showError("Tell PATHORA a little about the journey you have in mind.");
        input.focus();
        return;
    }

    setLoading(true);

    try {
        const response = await fetch("/api/travel", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message,
                thread_id: currentThreadId
            })
        });

        let data;
        try {
            data = await response.json();
        } catch {
            throw new Error("PATHORA returned an unexpected response. Please try again.");
        }

        if (!response.ok || !data.success) {
            throw new Error(data.error || "PATHORA could not build the route right now.");
        }

        currentThreadId = data.thread_id;
        localStorage.setItem("pathora_thread_id", currentThreadId);
        showResult(data.answer, data.thread_id);
    } catch (error) {
        showError(error.message || "Something went wrong while building your journey.");
    } finally {
        setLoading(false);
    }
}

async function copyResult() {
    const resultBox = $("#resultBox");
    const text = resultBox.innerText.trim();
    if (!text) return;

    try {
        await navigator.clipboard.writeText(text);
        const copyBtn = $(".copy-btn");
        const oldText = copyBtn.textContent;
        copyBtn.textContent = "Copied";
        setTimeout(() => { copyBtn.textContent = oldText; }, 1400);
    } catch {
        showError("Could not copy the journey plan.");
    }
}

function downloadPDF() {
    const pdfContent = $("#pdfContent");

    if (!latestAnswerMarkdown || !pdfContent) {
        showError("Build a journey plan before saving it as a PDF.");
        return;
    }

    if (typeof html2pdf === "undefined") {
        showError("PDF export is still loading. Please try again in a moment.");
        return;
    }

    const downloadBtn = $(".download-btn");
    const oldText = downloadBtn.innerHTML;
    downloadBtn.textContent = "Preparing…";
    downloadBtn.disabled = true;

    const options = {
        margin: 0.5,
        filename: "pathora-journey-plan.pdf",
        image: { type: "jpeg", quality: 0.97 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: "#fffdf8"
        },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] }
    };

    html2pdf()
        .set(options)
        .from(pdfContent)
        .save()
        .then(() => {
            downloadBtn.innerHTML = oldText;
            downloadBtn.disabled = false;
        })
        .catch(() => {
            downloadBtn.innerHTML = oldText;
            downloadBtn.disabled = false;
            showError("PATHORA could not create the PDF. Please try again.");
        });
}

document.addEventListener("DOMContentLoaded", () => {
    const input = $("#userInput");
    input.addEventListener("input", updateCharacterCount);
    updateCharacterCount();

    input.addEventListener("keydown", (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }
    });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const resultSection = $("#resultSection");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = "running";
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    observer.observe(resultSection);
});
