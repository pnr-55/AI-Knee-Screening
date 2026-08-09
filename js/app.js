// ==========================================
// AI-Knee-Screening
// Risk Assessment Engine
// ==========================================

console.log("AI-Knee-Screening System Started");

// ข้อมูลสำหรับการประเมิน
const assessmentData = {
    age: 0,
    height: 0,
    weight: 0,
    symptomScore: 0,
    leftKneeAngle: null,
    rightKneeAngle: null
};

// ==========================================
// BMI Calculation
// ==========================================

function calculateBMI(weight, height) {
    if (!weight || !height || height <= 0) {
        return 0;
    }

    const heightInMeter = height / 100;
    return weight / (heightInMeter * heightInMeter);
}
// ==========================================
// Age Risk Score
// Maximum = 20 points
// ==========================================
// ==========================================
// BMI Risk Score
// Maximum = 20 points
// ==========================================

function calculateBMIScore(bmi, age) {

    // สำหรับผู้ที่อายุต่ำกว่า 20 ปี
    // ต้องใช้ BMI-for-age ในการประเมิน
    if (age < 20) {
        return 0;
    }

    if (!bmi || bmi <= 0) {
        return 0;
    }

    if (bmi < 18.5) {
        return 0;
    }

    if (bmi < 25) {
        return 5;
    }

    if (bmi < 30) {
        return 12;
    }

    if (bmi < 35) {
        return 16;
    }

    return 20;
}

function calculateAgeScore(age) {

    if (!age || age < 0) {
        return 0;
    }

    if (age < 40) {
        return 0;
    }

    if (age < 50) {
        return 5;
    }

    if (age < 60) {
        return 10;
    }

    if (age < 70) {
        return 15;
    }

    return 20;
}
// ==========================================
// Risk Score Calculation
// ==========================================

function calculateRiskScore(data) {

    const symptomScore = data.symptomScore || 0;

    const bmi = calculateBMI(data.weight, data.height);

    const leftAngle = data.leftKneeAngle;
    const rightAngle = data.rightKneeAngle;

    console.log("Assessment Data:", data);
    console.log("BMI:", bmi);
    console.log("Symptom Score:", symptomScore);
    console.log("Left Knee Angle:", leftAngle);
    console.log("Right Knee Angle:", rightAngle);

    // ตอนนี้ยังไม่คำนวณคะแนนสุดท้าย
    // เราจะสร้างสูตรที่ตรวจสอบได้ในขั้นถัดไป

    return {
        bmi: Number(bmi.toFixed(2)),
        symptomScore: symptomScore,
        leftKneeAngle: leftAngle,
        rightKneeAngle: rightAngle
    };
}
