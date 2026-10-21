(() => {
    const viewer = document.querySelector(".photo-viewer");
    const photos = Array.from(document.querySelectorAll(".hobby-feature__media img"));

    if (!viewer || typeof viewer.showModal !== "function" || !photos.length) {
        return;
    }

    const image = viewer.querySelector(".photo-viewer__image");
    const caption = viewer.querySelector("figcaption");
    const position = viewer.querySelector(".photo-viewer__position");
    const original = viewer.querySelector(".photo-viewer__original");
    let currentIndex = 0;
    let opener = null;

    function showPhoto(index) {
        currentIndex = (index + photos.length) % photos.length;
        const photo = photos[currentIndex];
        image.src = photo.currentSrc || photo.src;
        image.alt = photo.alt;
        caption.textContent = photo.alt;
        position.textContent = `Photo ${currentIndex + 1} of ${photos.length}`;
        original.href = photo.src;
    }

    photos.forEach((photo, index) => {
        const link = document.createElement("a");
        link.className = "hobby-photo";
        link.href = photo.src;
        link.setAttribute("aria-label", `Enlarge photo: ${photo.alt}`);
        link.setAttribute("aria-haspopup", "dialog");
        photo.before(link);
        link.appendChild(photo);

        const hint = document.createElement("span");
        hint.className = "hobby-photo__hint";
        hint.textContent = "Enlarge ↗";
        hint.setAttribute("aria-hidden", "true");
        link.appendChild(hint);

        link.addEventListener("click", (event) => {
            // Preserve browser shortcuts for opening the original in another tab.
            if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
                return;
            }
            event.preventDefault();
            opener = link;
            showPhoto(index);
            viewer.showModal();
            document.documentElement.classList.add("photo-viewer-open");
        });
    });

    viewer.querySelector(".photo-viewer__close").addEventListener("click", () => viewer.close());
    viewer.querySelectorAll("[data-photo-step]").forEach((button) => {
        button.addEventListener("click", () => showPhoto(currentIndex + Number(button.dataset.photoStep)));
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
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            showPhoto(currentIndex + (event.key === "ArrowLeft" ? -1 : 1));
        }
    });

    // Native dialog provides Escape dismissal, focus trapping, and an inert page.
    viewer.addEventListener("close", () => {
        document.documentElement.classList.remove("photo-viewer-open");
        opener?.focus({ preventScroll: true });
    });
})();
