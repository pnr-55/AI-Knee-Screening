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
            if (typeof initAICamera === 'function') {
                initAICamera();
            }
        });
    }

    // หน้า Camera -> ย้อนกลับไปหน้าแบบสอบถาม
    const btnCameraBack = document.getElementById('btn-camera-back');
    if (btnCameraBack) {
        btnCameraBack.addEventListener('click', () => {
            if (typeof stopAICamera === 'function') {
                stopAICamera();
            }
            navigateTo('questionnaire-screen');
        });
    }

    // หน้า Camera -> กดปุ่มประเมินผลโครงสร้าง (Capture & Calculate)
    const btnCapture = document.getElementById('btn-capture-scan');
    if (btnCapture) {
        btnCapture.addEventListener('click', () => {
            if (typeof stopAICamera === 'function') {
                stopAICamera();
            }

            const state = getState();
            const finalResult = calculateTotalRiskScore(
                state.patientInfo,
                state.risk.symptomScore,
                typeof latestPoseData !== 'undefined' ? latestPoseData : { leftKneeAngle: 180, rightKneeAngle: 180 }
            );

            updateRiskResults(finalResult);
            renderResultScreen(finalResult);
            navigateTo('result-screen');
        });
    }

    // หน้า Result -> ย้อนกลับไปหน้า Camera
    const btnResultBack = document.getElementById('btn-result-back');
    if (btnResultBack) {
        btnResultBack.addEventListener('click', () => {
            navigateTo('camera-screen');
            if (typeof initAICamera === 'function') {
                initAICamera();
            }
        });
    }

    // หน้า Result -> กดปุ่มพิมพ์รายงานผล (Medical Report Print)
    const btnPrintReport = document.getElementById('btn-print-report');
    if (btnPrintReport) {
        btnPrintReport.addEventListener('click', () => {
            window.print(); // สั่งพิมพ์หน้าจอเป็น PDF ทันที
        });
    }

    // หน้า Result -> กดปุ่มไปหน้าส่งต่อโรงพยาบาล
    const btnGotoReferral = document.getElementById('btn-goto-referral');
    if (btnGotoReferral) {
        btnGotoReferral.addEventListener('click', () => {
            navigateTo('referral-screen');
        });
    }

    // หน้า Referral -> ย้อนกลับไปหน้า Result
    const btnReferralBack = document.getElementById('btn-referral-back');
    if (btnReferralBack) {
        btnReferralBack.addEventListener('click', () => {
            navigateTo('result-screen');
        });
    }

    // หน้า Referral -> กดปุ่มส่งข้อมูล
    const btnSubmitReferral = document.getElementById('btn-submit-referral');
    if (btnSubmitReferral) {
        btnSubmitReferral.addEventListener('click', () => {
            const hospitalSelect = document.getElementById('select-hospital').value;
            const chkConsent = document.getElementById('chk-referral-consent');

            if (!hospitalSelect) {
                alert('กรุณาเลือกโรงพยาบาลปลายทาง');
                return;
            }
            if (!chkConsent || !chkConsent.checked) {
                alert('กรุณาติ๊กยอมรับเงื่อนไขการส่งต่อข้อมูลทางการแพทย์');
                return;
            }

            // ไปยังหน้าส่งข้อมูลสำเร็จ
            navigateTo('success-screen');
        });
    }

    // หน้า Medical Login -> ย้อนกลับไปหน้าแรก
    const btnMedicalBack = document.getElementById('btn-medical-back');
    if (btnMedicalBack) {
        btnMedicalBack.addEventListener('click', () => {
            navigateTo('home-screen');
        });
    }

    // หน้า Medical Login -> กดปุ่มเข้าสู่ระบบ (จำลอง: admin / 1234)
    const btnMedicalLogin = document.getElementById('btn-medical-login');
    if (btnMedicalLogin) {
        btnMedicalLogin.addEventListener('click', () => {
            const user = document.getElementById('medical-user').value.trim();
            const pass = document.getElementById('medical-pass').value.trim();

            if (user === 'admin' && pass === '1234') {
                alert('เข้าสู่ระบบสำเร็จ');
                navigateTo('medical-dashboard-screen');
            } else {
                alert('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง (แนะนำใช้ admin / 1234)');
            }
        });
    }

    // หน้า Medical Dashboard -> ออกจากระบบ
    const btnMedicalLogout = document.getElementById('btn-medical-logout');
    if (btnMedicalLogout) {
        btnMedicalLogout.addEventListener('click', () => {
            document.getElementById('medical-user').value = '';
            document.getElementById('medical-pass').value = '';
            navigateTo('home-screen');
        });
    }

    const backHomeButtons = document.querySelectorAll('.btn-back-home');
    backHomeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (typeof stopAICamera === 'function') {
                stopAICamera();
            }
            navigateTo('home-screen');
        });
    });
}

function renderResultScreen(result) {
    document.getElementById('res-total-score').innerText = `${result.totalScore} / 100`;
    
    const badge = document.getElementById('res-risk-level');
    badge.innerText = result.riskLevel.level;
    badge.style.backgroundColor = result.riskLevel.color;
    
    document.getElementById('res-risk-desc').innerText = result.riskLevel.description;

    document.getElementById('detail-symptom').innerText = result.symptomScore;
    document.getElementById('detail-bmi').innerText = result.bmiScore;
    document.getElementById('detail-bmi-val').innerText = `${result.bmiValue} (${result.bmiCategory})`;
    document.getElementById('detail-pose').innerText = result.poseScore;
    document.getElementById('detail-age').innerText = result.ageScore;

    const btnReferral = document.getElementById('btn-goto-referral');
    if (result.totalScore > 60) {
        btnReferral.style.display = 'block';
    } else {
        btnReferral.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});
