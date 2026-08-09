⁠/**
 * Application Entry Point & Navigation Controller
 */

// สลับการแสดงผล Screen บน UI
function navigateTo(targetStepId) {
    const screens = document.querySelectorAll('.screen');
    let targetFound = false;

    screens.forEach(screen => {
        if (screen.id === targetStepId) {
            screen.classList.add('active');
            targetFound = true;
        } else {
            screen.classList.remove('active');
        }
    });

    if (targetFound) {
        setCurrentStep(targetStepId);
    } else {
        console.error(`Screen ID "${targetStepId}" not found.`);
    }
}

// ผูก Event Listeners หลัก
function initApp() {
    // หน้า Home -> ปุ่มเริ่มคัดกรอง
    const btnStart = document.getElementById('btn-start-screening');
    if (btnStart) {
        btnStart.addEventListener('click', () => {
            navigateTo('consent-screen');
        });
    }

    // หน้า Home -> ปุ่ม Medical Portal
    const btnMedical = document.getElementById('btn-go-medical');
    if (btnMedical) {
        btnMedical.addEventListener('click', () => {
            navigateTo('medical-login-screen');
        });
    }

    // หน้า Consent -> ย้อนกลับไป Home
    const btnConsentBack = document.getElementById('btn-consent-back');
    if (btnConsentBack) {
        btnConsentBack.addEventListener('click', () => {
            navigateTo('home-screen');
        });
    }

    // หน้า Consent -> ไป Questionnaire
    const btnConsentNext = document.getElementById('btn-consent-next');
    if (btnConsentNext) {
        btnConsentNext.addEventListener('click', () => {
            const chkConsent = document.getElementById('chk-consent');
            if (chkConsent && chkConsent.checked) {
                updatePatientInfo({ isConsented: true });
                navigateTo('questionnaire-screen');
            } else {
                alert('กรุณาติ๊กยอมรับเงื่อนไขข้อตกลงก่อนดำเนินการต่อ');
            }
        });
    }

    // ปุ่มย้อนกลับหน้าแรกทั่วไป
    const backHomeButtons = document.querySelectorAll('.btn-back-home');
    backHomeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            navigateTo('home-screen');
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});
