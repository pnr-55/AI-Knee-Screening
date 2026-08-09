/**
 * Application Entry Point & Navigation Controller
 */
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
        if (targetStepId === 'questionnaire-screen' && typeof renderQuestionnaire === 'function') {
            renderQuestionnaire();
        }
    } else {
        console.error(`Screen ID "${targetStepId}" not found.`);
    }
}

function initApp() {
    const btnStart = document.getElementById('btn-start-screening');
    if (btnStart) {
        btnStart.addEventListener('click', () => {
            navigateTo('consent-screen');
        });
    }

    const btnMedical = document.getElementById('btn-go-medical');
    if (btnMedical) {
        btnMedical.addEventListener('click', () => {
            navigateTo('medical-login-screen');
        });
    }

    const btnConsentBack = document.getElementById('btn-consent-back');
    if (btnConsentBack) {
        btnConsentBack.addEventListener('click', () => {
            navigateTo('home-screen');
        });
    }

    const btnConsentNext = document.getElementById('btn-consent-next');
    if (btnConsentNext) {
        btnConsentNext.addEventListener('click', () => {
            const chkConsent = document.getElementById('chk-consent');
            const ageInput = document.getElementById('input-age').value;
            const genderInput = document.getElementById('select-gender').value;
            const weightInput = document.getElementById('input-weight').value;
            const heightInput = document.getElementById('input-height').value;

            if (!chkConsent || !chkConsent.checked) {
                alert('กรุณาติ๊กยอมรับเงื่อนไขข้อตกลงก่อนดำเนินการต่อ');
                return;
            }

            const age = parseInt(ageInput, 10);
            const weight = parseFloat(weightInput);
            const height = parseFloat(heightInput);

            if (isNaN(age) || age <= 0 || age > 120) {
                alert('กรุณากรอกอายุให้ถูกต้อง (ระหว่าง 1 - 120 ปี)');
                return;
            }
            if (!genderInput) {
                alert('กรุณาเลือกเพศ');
                return;
            }
            if (isNaN(weight) || weight <= 0 || weight > 300) {
                alert('กรุณากรอกน้ำหนักให้ถูกต้อง (kg)');
                return;
            }
            if (isNaN(height) || height <= 0 || height > 250) {
                alert('กรุณากรอกส่วนสูงให้ถูกต้อง (cm)');
                return;
            }

            updatePatientInfo({
                age: age,
                gender: genderInput,
                weight: weight,
                height: height,
                isConsented: true
            });

            navigateTo('questionnaire-screen');
        });
    }

    const btnQBack = document.getElementById('btn-questionnaire-back');
    if (btnQBack) {
        btnQBack.addEventListener('click', () => {
            navigateTo('consent-screen');
        });
    }

    const btnQNext = document.getElementById('btn-questionnaire-next');
    if (btnQNext) {
        btnQNext.addEventListener('click', () => {
            if (!validateQuestionnaireCompletion()) {
                alert('กรุณาตอบคำถามให้ครบทั้ง 8 ข้อก่อนดำเนินการต่อ');
                return;
            }

            const symptomResult = calculateSymptomScore();
            updateQuestionnaireAnswers(symptomResult.answers, true);
            
            const currentRisk = getState().risk;
            updateRiskResults({
                ...currentRisk,
                symptomScore: symptomResult.score
            });

            navigateTo('camera-screen');
        });
    }

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
