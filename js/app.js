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

    // 2. Consent -> Questionnaire
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
            // โหลดแบบสอบถามซ้ำเพื่อให้แน่ใจว่าแสดงผลครบ
            if (typeof loadQuestionnaire === 'function') {
                loadQuestionnaire();
            }
        });
    }

    // 3. Questionnaire -> Camera
    const btnQBack = document.getElementById('btn-questionnaire-back');
    if (btnQBack) {
        btnQBack.addEventListener('click', () => switchScreen('consent-screen'));
    }

    const btnQNext = document.getElementById('btn-questionnaire-next');
    if (btnQNext) {
        btnQNext.addEventListener('click', () => {
            switchScreen('camera-screen');
            // เริ่มต้นกล้อง AI
            if (typeof initAICamera === 'function') {
                initAICamera();
            }
        });
    }

    // 6. Camera -> Questionnaire / Result
    const btnCamBack = document.getElementById('btn-camera-back');
    if (btnCamBack) {
        btnCamBack.addEventListener('click', () => {
            if (typeof stopAICamera === 'function') stopAICamera();
            switchScreen('questionnaire-screen');
        });
    }

    const btnCapture = document.getElementById('btn-capture-scan');
    if (btnCapture) {
        btnCapture.addEventListener('click', () => {
            if (typeof stopAICamera === 'function') stopAICamera();
            switchScreen('result-screen');
            if (typeof calculateFinalScore === 'function') {
                calculateFinalScore();
            }
        });
    }

    // 8. Result Screen Buttons
    const btnResultBack = document.getElementById('btn-result-back');
    if (btnResultBack) {
        btnResultBack.addEventListener('click', () => switchScreen('camera-screen'));
    }

    const btnPrintReport = document.getElementById('btn-print-report');
    if (btnPrintReport) {
        btnPrintReport.addEventListener('click', () => window.print());
    }

    const btnGotoReferral = document.getElementById('btn-goto-referral');
    if (btnGotoReferral) {
        btnGotoReferral.addEventListener('click', () => switchScreen('referral-screen'));
    }

    // 9. Referral Screen Buttons
    const btnRefBack = document.getElementById('btn-referral-back');
    if (btnRefBack) {
        btnRefBack.addEventListener('click', () => switchScreen('result-screen'));
    }

    const btnSubmitRef = document.getElementById('btn-submit-referral');
    if (btnSubmitRef) {
        btnSubmitRef.addEventListener('click', () => {
            const chkRef = document.getElementById('chk-referral-consent');
            const selectHosp = document.getElementById('select-hospital');
            if (selectHosp && selectHosp.value === '') {
                alert('กรุณาเลือกโรงพยาบาลปลายทาง');
                return;
            }
            if (chkRef && !chkRef.checked) {
                alert('กรุณากดยอมรับการยินยอมส่งต่อข้อมูล');
                return;
            }
            switchScreen('success-screen');
        });
    }

    // ปุ่มกลับหน้าแรกทั่วไป
    document.querySelectorAll('.btn-back-home').forEach(btn => {
        btn.addEventListener('click', () => {
            if (typeof stopAICamera === 'function') stopAICamera();
            switchScreen('home-screen');
        });
    });

    // Medical Login -> Dashboard
    const btnMedLogin = document.getElementById('btn-medical-login');
    if (btnMedLogin) {
        btnMedLogin.addEventListener('click', () => switchScreen('medical-dashboard-screen'));
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
