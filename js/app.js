// --- Main Application Controller ---
document.addEventListener('DOMContentLoaded', () => {
    const screens = document.querySelectorAll('.screen');

    function switchScreen(screenId) {
        screens.forEach(screen => {
            screen.classList.remove('active');
        });
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            window.scrollTo(0, 0);
        }
    }

    // 1. Home -> Consent
    const btnStart = document.getElementById('btn-start-screening');
    if (btnStart) {
        btnStart.addEventListener('click', () => switchScreen('consent-screen'));
    }

    // Home -> Medical Login
    const btnMedical = document.getElementById('btn-go-medical');
    if (btnMedical) {
        btnMedical.addEventListener('click', () => switchScreen('medical-login-screen'));
    }

    // 2. Consent -> Questionnaire / Home
    const btnConsentBack = document.getElementById('btn-consent-back');
    if (btnConsentBack) {
        btnConsentBack.addEventListener('click', () => switchScreen('home-screen'));
    }

    const btnConsentNext = document.getElementById('btn-consent-next');
    if (btnConsentNext) {
        btnConsentNext.addEventListener('click', () => {
            const chk = document.getElementById('chk-consent');
            if (chk && !chk.checked) {
                alert('กรุณากดยอมรับเงื่อนไขและข้อตกลงก่อนดำเนินการต่อ');
                return;
            }
            switchScreen('questionnaire-screen');
        });
    }

    // 3. Questionnaire -> Camera / Consent
    const btnQBack = document.getElementById('btn-questionnaire-back');
    if (btnQBack) {
        btnQBack.addEventListener('click', () => switchScreen('consent-screen'));
    }

    const btnQNext = document.getElementById('btn-questionnaire-next');
    if (btnQNext) {
        btnQNext.addEventListener('click', () => {
            switchScreen('camera-screen');
            // เริ่มต้นการทำงานกล้อง (ถ้ามีฟังก์ชัน initCamera จาก camera.js)
            if (typeof initCamera === 'function') {
                initCamera();
            }
        });
    }

    // 6. Camera -> Questionnaire / Result (จำลองปุ่มสแกน)
    const btnCamBack = document.getElementById('btn-camera-back');
    if (btnCamBack) {
        btnCamBack.addEventListener('click', () => switchScreen('questionnaire-screen'));
    }

    const btnCapture = document.getElementById('btn-capture-scan');
    if (btnCapture) {
        btnCapture.addEventListener('click', () => {
            switchScreen('result-screen');
            if (typeof calculateFinalScore === 'function') {
                calculateFinalScore();
            }
        });
    }

    // ปุ่มกลับหน้าแรกทั่วไป
    document.querySelectorAll('.btn-back-home').forEach(btn => {
        btn.addEventListener('click', () => switchScreen('home-screen'));
    });

    // Medical Login -> Dashboard
    const btnMedLogin = document.getElementById('btn-medical-login');
    if (btnMedLogin) {
        btnMedLogin.addEventListener('click', () => {
            switchScreen('medical-dashboard-screen');
        });
    }

    const btnMedLogout = document.getElementById('btn-medical-logout');
    if (btnMedLogout) {
        btnMedLogout.addEventListener('click', () => switchScreen('medical-login-screen'));
    }

    const btnMedBack = document.getElementById('btn-medical-back');
    if (btnMedBack) {
        btnMedBack.addEventListener('click', () => switchScreen('home-screen'));
    }
});
