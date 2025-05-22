// Data structure: Each slice holds an array of song objects {name, url, audio}
const slicesSongs = {
    sliceWrraper1: [],
    sliceWrraper2: [],
    sliceWrraper3: [],
    sliceWrraper4: [],
    sliceWrraper5: [],
    sliceWrraper6: [],
    sliceWrraper7: [],
};

let currentAudio = null;
let currentSliceId = null;
let animationRequestId = null;
let activeSliceId = null;

let audioContext;
let analyser;
let dataArray;
let bufferLength;
let canvasCtx;
let visualizerCanvas;

// Slice animation offsets
const sliceOffsets = {
    sliceWrraper1: { x: '0.5vw', y: '-1vw' },
    sliceWrraper2: { x: '1vw', y: '-0.4vw' },
    sliceWrraper3: { x: '1vw', y: '0.5vw' },
    sliceWrraper4: { x: '0vw', y: '1vw' },
    sliceWrraper5: { x: '-1vw', y: '0.5vw' },
    sliceWrraper6: { x: '-1vw', y: '-0.4vw' },
    sliceWrraper7: { x: '-0.5vw', y: '-1vw' },
};

function animateSlice(id, offsetX, offsetY) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.transform = `translate(${offsetX}, ${offsetY})`;
    el.style.transition = 'transform 0.5s ease';
    setTimeout(() => el.style.transform = '', 600);
}

function setActiveSlice(sliceId) {
    if (activeSliceId && activeSliceId !== sliceId) {
        const prevEl = document.getElementById(activeSliceId);
        if (prevEl) prevEl.classList.remove('active-slice');
    }
    const el = document.getElementById(sliceId);
    if (el) el.classList.add('active-slice');
    activeSliceId = sliceId;
}

function formatTime(time) {
    if (isNaN(time) || time === Infinity) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateProgressText(currentTime, duration) {
    const progressText = document.getElementById('progressText');
    progressText.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
}

function animateProgressWithAudio(audio) {
    const progressCircle = document.getElementById('progressCircle');
    const canvas = document.getElementById('visualizerCanvas');
    const ctx = canvas.getContext('2d');

    canvasCtx = ctx;
    visualizerCanvas = canvas;

    let wavePhase = 0; // used to animate the wavy effect

    function update() {
        if (audio.duration && !isNaN(audio.duration)) {
            const percent = (audio.currentTime / audio.duration) * 360;
            progressCircle.style.background = `conic-gradient(#00ff99 ${percent}deg, #222 ${percent}deg)`;
            updateProgressText(audio.currentTime, audio.duration);
        }

        if (ctx && analyser) {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;

            analyser.getByteFrequencyData(dataArray);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const radius = canvas.width / 4;
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const bars = dataArray.length;
            const angleStep = (Math.PI * 2) / bars;

            wavePhase += 0.05; // controls speed of wave motion

            for (let i = 0; i < bars; i++) {
                const value = dataArray[i];
                const baseLength = value / 3;
                const waveOffset = Math.sin(i * 0.5 + wavePhase) * 8; // wavy effect
                const barLength = baseLength + waveOffset;

                const angle = i * angleStep;

                const x1 = centerX + Math.cos(angle) * radius;
                const y1 = centerY + Math.sin(angle) * radius;
                const x2 = centerX + Math.cos(angle) * (radius + barLength);
                const y2 = centerY + Math.sin(angle) * (radius + barLength);

                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);

                const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
                gradient.addColorStop(0, '#00ff99');
                gradient.addColorStop(1, '#ff00ff');

                ctx.strokeStyle = gradient;
                ctx.lineWidth = 3;
                ctx.shadowColor = '#ff00ff';
                ctx.shadowBlur = 12;
                ctx.stroke();
            }
        }

        if (!audio.paused) {
            animationRequestId = requestAnimationFrame(update);
        }
    }

    animationRequestId = requestAnimationFrame(update);
}

// Modal setup
const overlay = document.createElement('div');
overlay.id = 'overlay';
document.body.appendChild(overlay);

const modal = document.createElement('div');
modal.classList.add('modal');
document.body.appendChild(modal);

modal.onclick = e => e.stopPropagation();
overlay.onclick = closeModal;

function closeModal() {
    modal.classList.remove('active');
    overlay.classList.remove('active');
}

function handleSliceClick(sliceId) {
    const offset = sliceOffsets[sliceId] || { x: '0', y: '0' };
    animateSlice(sliceId, offset.x, offset.y);
    currentSliceId = sliceId;
    openModalForSlice(sliceId);
}

function openModalForSlice(sliceId) {
    modal.innerHTML = '';

    const header = document.createElement('h3');
    header.textContent = `Songs for ${sliceId}`;
    const closeBtn = document.createElement('div');
    closeBtn.classList.add('close-btn');
    closeBtn.textContent = '✖';
    closeBtn.onclick = closeModal;

    modal.appendChild(closeBtn);
    modal.appendChild(header);

    const songList = document.createElement('ul');
    songList.classList.add('song-list');

    slicesSongs[sliceId].forEach((song, index) => {
        const li = document.createElement('li');
        li.textContent = song.name;
        li.onclick = () => playSong(sliceId, index);
        songList.appendChild(li);
    });

    modal.appendChild(songList);

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'audio/*';
    fileInput.multiple = true;
    fileInput.onchange = event => {
        const files = Array.from(event.target.files);
        files.forEach(file => {
            const url = URL.createObjectURL(file);
            slicesSongs[sliceId].push({
                name: file.name,
                url,
                audio: null,
            });
        });
        openModalForSlice(sliceId);
    };

    modal.appendChild(fileInput);

    modal.classList.add('active');
    overlay.classList.add('active');
}

function playSong(sliceId, songIndex) {
    if (currentAudio) {
        currentAudio.pause();
        cancelAnimationFrame(animationRequestId);
    }

    const song = slicesSongs[sliceId][songIndex];
    if (!song) return;

    if (!song.audio) {
        song.audio = new Audio(song.url);
    }

    currentAudio = song.audio;

    // Setup audio context + analyser
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    const source = audioContext.createMediaElementSource(currentAudio);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 64;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);
    analyser.connect(audioContext.destination);

    currentAudio.onended = () => {
        cancelAnimationFrame(animationRequestId);
        const progressCircle = document.getElementById('progressCircle');
        progressCircle.style.background = `conic-gradient(#222 0deg, #222 0deg)`;
        updateProgressText(0, currentAudio.duration || 0);

        if (activeSliceId) {
            const el = document.getElementById(activeSliceId);
            if (el) el.classList.remove('active-slice');
            activeSliceId = null;
        }
    };

    currentAudio.onloadedmetadata = () => {
        updateProgressText(0, currentAudio.duration);
        currentAudio.play();
        animateProgressWithAudio(currentAudio);
        setActiveSlice(sliceId);
        closeModal();
    };

    if (currentAudio.readyState >= 1) {
        updateProgressText(0, currentAudio.duration);
        currentAudio.play();
        animateProgressWithAudio(currentAudio);
        setActiveSlice(sliceId);
        closeModal();
    }
}

function onStartUp() {
    updateProgressText(0, 0);
}

window.onload = onStartUp;
