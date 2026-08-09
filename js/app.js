    // หน้า Consent -> ไป Questionnaire (ตรวจสอบ Consent และข้อมูลพื้นฐาน)
    const btnConsentNext = document.getElementById('btn-consent-next');
    if (btnConsentNext) {
        btnConsentNext.addEventListener('click', () => {
            const chkConsent = document.getElementById('chk-consent');
            const ageInput = document.getElementById('input-age').value;
            const genderInput = document.getElementById('select-gender').value;
            const weightInput = document.getElementById('input-weight').value;
            const heightInput = document.getElementById('input-height').value;

            // 1. ตรวจสอบเงื่อนไขการยินยอม
            if (!chkConsent || !chkConsent.checked) {
                alert('กรุณาติ๊กยอมรับเงื่อนไขข้อตกลงก่อนดำเนินการต่อ');
                return;
            }

            // 2. Error Handling: ตรวจสอบความถูกต้องของข้อมูลพื้นฐาน
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

            // 3. บันทึกลง State กลาง
            updatePatientInfo({
                age: age,
                gender: genderInput,
                weight: weight,
                height: height,
                isConsented: true
            });

            // 4. เปลี่ยนหน้าไปแบบสอบถาม
            navigateTo('questionnaire-screen');
        });
    }
