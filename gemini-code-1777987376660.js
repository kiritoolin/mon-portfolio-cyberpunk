document.addEventListener("DOMContentLoaded", () => {
    // 1. BOOT SCREEN & AUDIO UNLOCK
    const bootScreen = document.getElementById('boot-screen');
    const btnEnter = document.getElementById('btn-enter');
    const bgMusic = document.getElementById('bgMusic');
    const btnMute = document.getElementById('btn-mute');
    const audioWave = document.getElementById('audio-wave');
    let isMusicPlaying = false;

    // L'utilisateur DOIT interagir pour lancer l'audio (règle des navigateurs)
    btnEnter.addEventListener('click', () => {
        bootScreen.style.opacity = '0';
        setTimeout(() => bootScreen.style.display = 'none', 800);
        
        // Démarrage de la musique
        bgMusic.volume = 0.4;
        bgMusic.play().then(() => {
            isMusicPlaying = true;
            audioWave.classList.add('playing');
        }).catch(err => console.warn("Audio bloqué:", err));
    });

    // Toggle Audio
    btnMute.addEventListener('click', () => {
        if (isMusicPlaying) {
            bgMusic.pause();
            btnMute.innerText = "🔇 OFF";
            audioWave.classList.remove('playing');
        } else {
            bgMusic.play();
            btnMute.innerText = "🔊 ON";
            audioWave.classList.add('playing');
        }
        isMusicPlaying = !isMusicPlaying;
    });

    // 2. SCROLL REVEAL (Intersection Observer)
    const reveals = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    reveals.forEach(reveal => revealOnScroll.observe(reveal));

    // 3. FONCTION FINALE: REMEMBER BUTTON
    const btnRemember = document.getElementById('btn-remember');
    
    btnRemember.addEventListener('click', () => {
        // Ajout de la classe CSS pour le glitch extreme
        document.body.classList.add('matrix-collapse');
        btnRemember.innerText = "CRITICAL ERROR";
        
        // Génération d'un son Cyberpunk brut (Web Audio API)
        generateGlitchSound();

        // Réinitialisation après 2.5 secondes
        setTimeout(() => {
            document.body.classList.remove('matrix-collapse');
            btnRemember.innerText = "SYSTEM RESTORED";
            btnRemember.style.pointerEvents = "none"; // Désactive le bouton
            btnRemember.style.borderColor = "var(--green)";
            btnRemember.style.color = "var(--green)";
        }, 2500);
    });

    // Fonction de sound design génératif (Basse distortion)
    function generateGlitchSound() {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        // Oscillateur principal (basse fureur)
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(55, audioCtx.currentTime); // Fréquence basse (A1)
        osc.frequency.exponentialRampToValueAtTime(10, audioCtx.currentTime + 1); // Drop

        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 2); // Fade out
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.start();
        
        // Bruit blanc pour l'effet "électricité/étincelle"
        const bufferSize = audioCtx.sampleRate * 2; // 2 secondes
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        const noiseFilter = audioCtx.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.value = 1000;
        
        noise.connect(noiseFilter);
        noiseFilter.connect(gainNode);
        noise.start();
        
        setTimeout(() => { osc.stop(); noise.stop(); }, 2500);
    }
});