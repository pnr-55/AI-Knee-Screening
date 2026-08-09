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
