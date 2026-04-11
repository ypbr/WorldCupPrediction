import html2canvas from "html2canvas";

const APP_URL = "https://wc2026.ypbr.dev/";

/**
 * Returns true if the browser supports the Web Share API (basic check).
 * Used to decide whether to show a "Share" button vs download.
 */
export function canShare() {
    return typeof navigator.share === "function";
}

/**
 * Returns true if the browser supports sharing files via Web Share API.
 */
export function canShareFiles() {
    if (!navigator.canShare) return false;
    try {
        const testFile = new File([""], "test.jpg", { type: "image/jpeg" });
        return navigator.canShare({ files: [testFile] });
    } catch {
        return false;
    }
}

/**
 * Renders a DOM element to a JPEG Blob using html2canvas.
 * @param {HTMLElement} element
 * @returns {Promise<Blob>}
 */
export async function generateStoryImage(element) {
    const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#0f172a",
        width: 360,
        height: 640,
        logging: false,
    });

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (blob) resolve(blob);
                else reject(new Error("Failed to generate image blob"));
            },
            "image/jpeg",
            0.92,
        );
    });
}

/**
 * Downloads a JPEG Blob as a file (desktop fallback).
 * @param {Blob} blob
 */
export function downloadStoryImage(blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-wc2026-prediction.jpg";
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * Shares a JPEG Blob via Web Share API (mobile) or triggers download (desktop).
 * @param {Blob} blob
 * @param {string} championName
 */
export async function shareStoryToInstagram(blob, championName) {
    const fileName = "my-wc2026-prediction.jpg";
    const file = new File([blob], fileName, { type: "image/jpeg" });

    const shareText = championName
        ? `🏆 My World Cup 2026 prediction: ${championName} wins it all!`
        : "🏆 My World Cup 2026 prediction!";

    if (canShareFiles()) {
        // Mobile browser supports file sharing
        await navigator.share({
            files: [file],
            title: "World Cup 2026 Prediction",
            text: `${shareText} Make yours at ${APP_URL}`,
        });
    } else if (canShare()) {
        // Mobile browser supports basic sharing but not files — share URL only
        await navigator.share({
            title: "World Cup 2026 Prediction",
            text: shareText,
            url: APP_URL,
        });
    } else {
        downloadStoryImage(blob);
    }
}
