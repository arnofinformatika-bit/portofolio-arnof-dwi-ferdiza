// ==========================================
// MODULE: INTRODUCTION & OPENING SPLASH
// Author: Arnof Dwi Ferdiza
// ==========================================

(function () {
    'use strict';

    // 1. Inject Dynamic Styles for Animated Text Splash & Mobile Responsive Layout
    const introSplashStyles = `
    /* ==========================================================================
       PURE ANIMATED TEXT SPLASH: WELCOME TO PORTFOLIO ARNOF
       ========================================================================== */
    .intro-splash-screen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: radial-gradient(circle at 50% 40%, #151b28 0%, #0a0d14 100%);
        z-index: 100000;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1.5rem;
        overflow: hidden;
        cursor: pointer;
        transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s ease;
        font-family: 'Poppins', sans-serif;
    }

    body.light-mode .intro-splash-screen {
        background: radial-gradient(circle at 50% 40%, #ffffff 0%, #f1f5f9 100%);
    }

    .intro-splash-content.text-splash-content {
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        z-index: 2;
        padding: 1.5rem;
        max-width: 900px;
        width: 100%;
        animation: splashZoomIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes splashZoomIn {
        0% { opacity: 0; transform: scale(0.92) translateY(20px); }
        100% { opacity: 1; transform: scale(1) translateY(0); }
    }

    /* Ambient Glowing Blobs */
    .splash-text-glow {
        position: absolute;
        border-radius: 50%;
        filter: blur(110px);
        pointer-events: none;
        z-index: 0;
        opacity: 0.28;
    }

    .splash-text-glow-gold {
        width: 480px;
        height: 480px;
        background: radial-gradient(circle, #ffd700 0%, rgba(255, 215, 0, 0) 70%);
        top: 20%;
        left: 50%;
        transform: translateX(-50%);
        animation: textGlowPulse 6s infinite alternate ease-in-out;
    }

    .splash-text-glow-blue {
        width: 380px;
        height: 380px;
        background: radial-gradient(circle, #38bdf8 0%, rgba(56, 189, 248, 0) 70%);
        bottom: 15%;
        right: 20%;
        opacity: 0.2;
    }

    /* Hero Text */
    .text-splash-hero {
        margin-bottom: 0.8rem;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .text-splash-welcome {
        display: block;
        font-size: clamp(1rem, 2.5vw, 1.4rem);
        font-weight: 700;
        letter-spacing: 8px;
        color: #64748b;
        text-transform: uppercase;
        margin-bottom: 0.2rem;
        opacity: 0;
        animation: splashFadeUp 0.8s 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    body.dark-mode .text-splash-welcome {
        color: #94a3b8;
    }

    .text-splash-title {
        font-size: clamp(2.4rem, 7vw, 5.2rem);
        font-weight: 900;
        line-height: 1.05;
        letter-spacing: 2px;
        text-transform: uppercase;
        margin: 0;
        color: #0f172a;
        text-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        opacity: 0;
        animation: splashZoomInText 0.9s 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    body.dark-mode .text-splash-title {
        color: #ffffff;
        text-shadow: 0 4px 30px rgba(255, 255, 255, 0.3);
    }

    /* Floating Skills Cloud (Flex wrap with gap for clean balance) */
    .splash-floating-items {
        position: relative;
        width: 100%;
        max-width: 820px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        gap: 10px 12px;
        margin: 1.2rem auto 1.4rem;
        z-index: 3;
    }

    .splash-float-pill {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 0.86rem;
        font-weight: 700;
        letter-spacing: 0.4px;
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        box-shadow: 0 8px 22px rgba(0, 0, 0, 0.08);
        user-select: none;
        transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
    }

    body.dark-mode .splash-float-pill {
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
    }

    .splash-float-pill:hover {
        transform: translateY(-4px) scale(1.08) !important;
        box-shadow: 0 14px 30px rgba(0, 0, 0, 0.18);
    }

    .float-item-code {
        background: rgba(16, 185, 129, 0.12);
        border: 1.5px solid rgba(16, 185, 129, 0.45);
        color: #10b981;
        animation: gentleFloat1 3.8s infinite alternate ease-in-out;
    }
    .pill-icon-code {
        font-family: monospace;
        font-weight: 900;
        font-size: 1.05rem;
        letter-spacing: -1px;
    }

    .float-item-html {
        background: rgba(249, 115, 22, 0.12);
        border: 1.5px solid rgba(249, 115, 22, 0.45);
        color: #f97316;
        animation: gentleFloat2 4.2s -1s infinite alternate ease-in-out;
    }

    .float-item-js {
        background: rgba(234, 179, 8, 0.12);
        border: 1.5px solid rgba(234, 179, 8, 0.45);
        color: #ca8a04;
        animation: gentleFloat1 4.5s -2s infinite alternate ease-in-out;
    }

    .float-item-ts {
        background: rgba(37, 99, 235, 0.12);
        border: 1.5px solid rgba(37, 99, 235, 0.45);
        color: #2563eb;
        animation: gentleFloat2 4s -0.8s infinite alternate ease-in-out;
    }

    .float-item-capcut {
        background: rgba(244, 63, 94, 0.12);
        border: 1.5px solid rgba(244, 63, 94, 0.45);
        color: #f43f5e;
        animation: gentleFloat1 4.7s -1.5s infinite alternate ease-in-out;
    }

    .float-item-fullstack {
        background: rgba(6, 182, 212, 0.12);
        border: 1.5px solid rgba(6, 182, 212, 0.45);
        color: #0891b2;
        animation: gentleFloat2 4.1s -2.2s infinite alternate ease-in-out;
    }

    .float-item-antigravity {
        background: linear-gradient(135deg, rgba(168, 85, 247, 0.18) 0%, rgba(212, 175, 55, 0.18) 100%);
        border: 1.5px solid rgba(168, 85, 247, 0.55);
        color: #9333ea;
        box-shadow: 0 8px 24px rgba(168, 85, 247, 0.2);
        animation: gentleFloatScale 3.6s infinite alternate ease-in-out;
    }

    .float-item-ai {
        background: rgba(139, 92, 246, 0.12);
        border: 1.5px solid rgba(139, 92, 246, 0.45);
        color: #7c3aed;
        animation: gentleFloat1 4.6s -1.8s infinite alternate ease-in-out;
    }

    .float-item-python {
        background: rgba(59, 130, 246, 0.12);
        border: 1.5px solid rgba(59, 130, 246, 0.45);
        color: #2563eb;
        animation: gentleFloat2 4.4s -0.5s infinite alternate ease-in-out;
    }

    .float-item-mongo {
        background: rgba(16, 185, 129, 0.12);
        border: 1.5px solid rgba(16, 185, 129, 0.45);
        color: #059669;
        animation: gentleFloat1 4.3s -2.5s infinite alternate ease-in-out;
    }

    .float-item-vscode {
        background: rgba(14, 165, 233, 0.12);
        border: 1.5px solid rgba(14, 165, 233, 0.45);
        color: #0284c7;
        animation: gentleFloat2 4.5s -1.2s infinite alternate ease-in-out;
    }

    @keyframes gentleFloat1 {
        0% { transform: translateY(0) rotate(-2deg); }
        100% { transform: translateY(-7px) rotate(2deg); }
    }

    @keyframes gentleFloat2 {
        0% { transform: translateY(0) rotate(2deg); }
        100% { transform: translateY(-8px) rotate(-2deg); }
    }

    @keyframes gentleFloatScale {
        0% { transform: translateY(0) scale(0.98); }
        100% { transform: translateY(-7px) scale(1.03); }
    }

    .text-splash-tagline {
        font-size: clamp(0.85rem, 2vw, 1.05rem);
        color: #64748b;
        font-weight: 600;
        letter-spacing: 0.5px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        flex-wrap: wrap;
        margin: 0;
        opacity: 0;
        animation: splashFadeUp 0.8s 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    body.dark-mode .text-splash-tagline {
        color: #cbd5e1;
    }

    .tag-dot {
        color: #ffd700;
        font-size: 1.1rem;
    }

    /* Keyframes */
    @keyframes splashFadeUp {
        from { opacity: 0; transform: translateY(24px); }
        to { opacity: 1; transform: translateY(0); }
    }

    @keyframes splashZoomInText {
        0% { opacity: 0; transform: scale(0.9) translateY(20px); }
        100% { opacity: 1; transform: scale(1) translateY(0); }
    }

    /* Mobile Responsiveness */
    @media (max-width: 768px) {
        .intro-splash-screen {
            padding: 1rem 0.8rem !important;
            align-items: center !important;
            justify-content: center !important;
        }

        .text-splash-content {
            padding: 0.6rem 0.4rem !important;
            max-width: 100% !important;
        }

        .text-splash-hero {
            margin-bottom: 0.4rem !important;
        }

        .text-splash-welcome {
            font-size: 0.82rem !important;
            letter-spacing: 4px !important;
            margin-bottom: 2px !important;
        }

        .text-splash-title {
            font-size: 2.2rem !important;
            letter-spacing: 1px !important;
        }

        .splash-floating-items {
            gap: 6px 7px !important;
            margin: 0.7rem auto 0.9rem !important;
            max-width: 340px !important;
        }

        .splash-float-pill {
            padding: 5px 11px !important;
            font-size: 0.74rem !important;
            border-radius: 12px !important;
            gap: 5px !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06) !important;
        }

        .pill-icon-code {
            font-size: 0.85rem !important;
        }

        .text-splash-tagline {
            font-size: 0.75rem !important;
            gap: 5px !important;
            line-height: 1.4 !important;
        }

        .tag-dot {
            font-size: 0.9rem !important;
        }
    }

    @media (max-width: 360px) {
        .text-splash-title {
            font-size: 1.95rem !important;
        }

        .splash-floating-items {
            max-width: 310px !important;
            gap: 5px 5px !important;
        }

        .splash-float-pill {
            padding: 4px 9px !important;
            font-size: 0.7rem !important;
        }

        .text-splash-tagline {
            font-size: 0.7rem !important;
        }
    }

    /* Confetti Particle */
    .intro-confetti-particle {
        position: fixed;
        width: 9px;
        height: 9px;
        z-index: 9999999;
        pointer-events: none;
        border-radius: 2px;
        animation: introConfettiFall 3s forwards cubic-bezier(0.25, 1, 0.5, 1);
    }

    @keyframes introConfettiFall {
        0% { opacity: 1; transform: translate(0, 0) rotate(0deg) scale(1); }
        100% { opacity: 0; transform: translate(var(--dx), var(--dy)) rotate(720deg) scale(0.2); }
    }
    `;

    // Inject styles dynamically into document head
    function injectStyles() {
        if (!document.getElementById('intro-splash-dynamic-styles')) {
            const style = document.createElement('style');
            style.id = 'intro-splash-dynamic-styles';
            style.textContent = introSplashStyles;
            document.head.appendChild(style);
        }
    }

    // 2. Pure Web Audio API Chime (Pleasant C-Major arpeggio)
    function playWelcomeChime() {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();

            const freqs = [523.25, 659.25, 783.99, 987.77, 1046.5];
            const now = ctx.currentTime;

            freqs.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + idx * 0.08);

                gain.gain.setValueAtTime(0, now + idx * 0.08);
                gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.08 + 0.03);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.1);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(now + idx * 0.08);
                osc.stop(now + idx * 0.08 + 1.2);
            });
        } catch (e) {
            // Audio policy ignored
        }
    }

    // 3. Celebratory Particle Confetti Burst
    function burstWelcomeConfetti(count = 55) {
        const colors = ['#ffd700', '#d4af37', '#38bdf8', '#10b981', '#f43f5e', '#a855f7', '#ffffff'];

        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.className = 'intro-confetti-particle';
            p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

            p.style.left = (window.innerWidth / 2 + (Math.random() - 0.5) * 240) + 'px';
            p.style.top = (Math.max(60, window.innerHeight * 0.25) + (Math.random() - 0.5) * 80) + 'px';

            const angle = Math.random() * 2 * Math.PI;
            const distance = 100 + Math.random() * 300;
            const dx = Math.cos(angle) * distance + 'px';
            const dy = (Math.sin(angle) * distance + 160) + 'px';

            p.style.setProperty('--dx', dx);
            p.style.setProperty('--dy', dy);

            document.body.appendChild(p);

            setTimeout(() => {
                if (p.parentNode) p.parentNode.removeChild(p);
            }, 3000);
        }
    }

    // 4. Transition Logic: Opening Splash -> Classic Login Card
    function proceedToLogin(e) {
        if (e && typeof e.stopPropagation === 'function') {
            e.stopPropagation();
        }

        const splash = document.getElementById('intro-splash-screen');
        const welcomeOverlay = document.getElementById('welcome-overlay');

        if (splash) {
            splash.style.transition = 'opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1), transform 0.45s ease';
            splash.style.opacity = '0';
            splash.style.transform = 'scale(1.03)';
            splash.style.pointerEvents = 'none';

            setTimeout(() => {
                splash.style.display = 'none';
            }, 450);
        }

        if (welcomeOverlay && !sessionStorage.getItem('visitorName')) {
            welcomeOverlay.style.display = 'flex';
            const inputEl = document.getElementById('visitorName');
            if (inputEl) {
                setTimeout(() => inputEl.focus(), 300);
            }
        }
    }

    // 5. Initialize Splash Experience on DOM Ready
    function initSplash() {
        injectStyles();

        const savedName = sessionStorage.getItem('visitorName');
        const splash = document.getElementById('intro-splash-screen');
        const overlay = document.getElementById('welcome-overlay');
        const isIntroductionRoute = window.location.hash.toLowerCase().includes('introduction');

        if (savedName) {
            // Already logged in
            if (splash) splash.style.display = 'none';
            if (overlay) overlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        } else if (isIntroductionRoute) {
            // Direct #/introduction navigation
            if (splash) splash.style.display = 'none';
            if (overlay) overlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        } else {
            // First-time visit: Wait for touch or click to login
            if (splash) {
                splash.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            } else if (overlay) {
                overlay.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        }
    }

    // Expose Public API to Window
    window.proceedToLogin = proceedToLogin;
    window.Introduction = {
        init: initSplash,
        proceedToLogin: proceedToLogin,
        burstConfetti: burstWelcomeConfetti,
        playChime: playWelcomeChime,
        play: function (visitorName) {
            burstWelcomeConfetti(50);
            playWelcomeChime();
        }
    };

    // Auto-listen to DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSplash);
    } else {
        initSplash();
    }

    console.log('[Introduction] Module loaded successfully.');
})();
