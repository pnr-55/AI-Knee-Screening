/**
 * Application Entry Point & Navigation Controller
 */

// สลับการแสดงผล Screen บน UI และทำการเรนเดอร์ข้อมูลเฉพาะหน้าถ้าจำเป็น
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
        
        // ถ้าเปลี่ยนมาหน้า Questionnaire ให้ทำการเรนเดอร์คำถามอัตโนมัติ
        if (targetStepId === 'questionnaire-screen' && typeof renderQuestionnaire === 'function') {
            renderQuestionnaire();
        }
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

    // หน้า Consent -> ไป Questionnaire (ตรวจสอบ Consent และข้อมูลพื้นฐาน)
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

            // บันทึกลง State กลาง
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

    // หน้า Questionnaire -> ย้อนกลับไป Consent
    const btnQBack = document.getElementById('btn-questionnaire-back');
    if (btnQBack) {
        btnQBack.addEventListener('click', () => {
            navigateTo('consent-screen');
        });
    }

    // หน้า Questionnaire -> ไปหน้า AI Camera (ตรวจสอบว่าตอบครบ 8 ข้อหรือยัง)
    const btnQNext = document.getElementById('btn-questionnaire-next');
    if (btnQNext) {
        btnQNext.addEventListener('click', () => {
            if (!validateQuestionnaireCompletion()) {
                alert('กรุณาตอบคำถามให้ครบทั้ง 8 ข้อก่อนดำเนินการต่อ');
                return;
            }

            // คำนวณ Symptom Score และบันทึกลง State กลาง
            const symptomResult = calculateSymptomScore();
            updateQuestionnaireAnswers(symptomResult.answers, true);
            
            // อัปเดต Symptom Score ลงในส่วน Risk ของ State
            const currentRisk = getState().risk;
            updateRiskResults({
                ...currentRisk,
                symptomScore: symptomResult.score
            });

            // ไปยังหน้า AI Camera (Placeholder ในขั้นตอนนี้)
            navigateTo('camera-screen');
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
