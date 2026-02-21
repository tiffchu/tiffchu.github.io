document.addEventListener("DOMContentLoaded", () => {
    const audio = document.getElementById("audio");
    const nowPlaying = document.getElementById("now-playing");
    const frequencyDisplay = document.getElementById("frequency");

    const playBtn = document.getElementById("play");
    const pauseBtn = document.getElementById("pause");
    const nextBtn = document.getElementById("next");
    const prevBtn = document.getElementById("prev");
    const volumeSlider = document.getElementById("volume");

    const playlist = [
        {
            title: "Blinding Lights – The Weeknd",
            freq: "FM 96.5",
            src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        },
        {
            title: "Noises – idk",
            freq: "FM 101.3",
            src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
        },
        {
            title: "Placeholder – Song 3",
            freq: "FM 88.9",
            src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
        }
    ];

    let currentIndex = 0;

    function loadSong(index) {
        audio.src = playlist[index].src;
        nowPlaying.textContent = `Now Playing: ${playlist[index].title}`;
        frequencyDisplay.textContent = playlist[index].freq;
    }

    loadSong(currentIndex);

    playBtn.addEventListener("click", () => audio.play());
    pauseBtn.addEventListener("click", () => audio.pause());

    nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % playlist.length;
        loadSong(currentIndex);
        audio.play();
    });

    prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
        loadSong(currentIndex);
        audio.play();
    });

    audio.addEventListener("ended", () => nextBtn.click());

    volumeSlider.addEventListener("input", e => {
        audio.volume = e.target.value;
    });
}); 
