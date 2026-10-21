(() => {
    const viewer = document.querySelector(".photo-viewer");
    const items = Array.from(document.querySelectorAll(".hobby-feature__media img, .hobby-feature__media video"));

    if (!viewer || typeof viewer.showModal !== "function" || !items.length) {
        return;
    }

    const image = viewer.querySelector("img");
    const video = viewer.querySelector("video");
    const caption = viewer.querySelector("figcaption");
    const position = viewer.querySelector(".photo-viewer__position");
    const original = viewer.querySelector(".photo-viewer__original");
    let currentIndex = 0;
    let opener = null;
    let playingPreviews = [];

    function mediaSource(item) {
        return item.currentSrc || item.src || item.querySelector("source").src;
    }

    function showMedia(index) {
        video.pause();
        currentIndex = (index + items.length) % items.length;
        const item = items[currentIndex];
        const isVideo = item.tagName === "VIDEO";
        const description = isVideo ? item.getAttribute("aria-label") : item.alt;
        const source = mediaSource(item);
        image.hidden = isVideo;
        video.hidden = !isVideo;

        if (isVideo) {
            if (video.src !== source) {
                video.src = source;
            }
            video.currentTime = 0;
            video.setAttribute("aria-label", description);
            // Native controls remain available if automatic playback is declined.
            video.play().catch(() => {});
        } else {
            image.src = source;
            image.alt = description;
        }

        caption.textContent = description;
        position.textContent = `Item ${currentIndex + 1} of ${items.length}`;
        original.href = source;
    }

    items.forEach((item, index) => {
        const isVideo = item.tagName === "VIDEO";
        const link = document.createElement("a");
        link.className = "hobby-photo";
        link.href = mediaSource(item);
        link.setAttribute("aria-label", `Enlarge ${isVideo ? "video" : "photo"}: ${isVideo ? item.getAttribute("aria-label") : item.alt}`);
        link.setAttribute("aria-haspopup", "dialog");
        item.before(link);
        link.appendChild(item);

        link.addEventListener("click", (event) => {
            // Preserve browser shortcuts for opening the original in another tab.
            if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
                return;
            }
            event.preventDefault();
            opener = link;
            playingPreviews = items.filter((preview) => preview.tagName === "VIDEO" && !preview.paused);
            playingPreviews.forEach((preview) => preview.pause());
            showMedia(index);
            viewer.showModal();
            document.documentElement.classList.add("photo-viewer-open");
        });
    });

    viewer.querySelector(".photo-viewer__close").addEventListener("click", () => viewer.close());
    viewer.querySelectorAll("[data-photo-step]").forEach((button) => {
        button.addEventListener("click", () => showMedia(currentIndex + Number(button.dataset.photoStep)));
    });

    let backdropPress = false;
    viewer.addEventListener("pointerdown", (event) => {
        backdropPress = event.target === viewer;
    });
    viewer.addEventListener("click", (event) => {
        if (backdropPress && event.target === viewer) {
            viewer.close();
        }
        backdropPress = false;
    });

    viewer.addEventListener("keydown", (event) => {
        // Let the video's native controls use arrow keys for seeking and volume.
        if (event.target === video) {
            return;
        }
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            showMedia(currentIndex + (event.key === "ArrowLeft" ? -1 : 1));
        }
    });

    // Native dialog provides Escape dismissal, focus trapping, and an inert page.
    viewer.addEventListener("close", () => {
        video.pause();
        playingPreviews.forEach((preview) => preview.play().catch(() => {}));
        playingPreviews = [];
        document.documentElement.classList.remove("photo-viewer-open");
        opener?.focus({ preventScroll: true });
    });
})();
