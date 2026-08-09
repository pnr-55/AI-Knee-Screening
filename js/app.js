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

    // -----------------------------
    // 1. Symptom Score
    // Maximum = 30
    // -----------------------------
    const symptomScore = Math.min(
        Math.max(data.symptomScore || 0, 0),
        30
    );

    // -----------------------------
    // 2. BMI
    // Maximum BMI Score = 20
    // -----------------------------
    const bmi = calculateBMI(
        data.weight,
        data.height
    );

    const bmiScore = calculateBMIScore(
        bmi,
        data.age
    );

    // -----------------------------
    // 3. Age Score
    // Maximum = 20
    // -----------------------------
    const ageScore = calculateAgeScore(
        data.age
    );

    // -----------------------------
    // 4. Knee Angle
    // ยังรอเชื่อมกับ AI Camera
    // -----------------------------
    const leftAngle = data.leftKneeAngle;
    const rightAngle = data.rightKneeAngle;

    // -----------------------------
    // 5. รวมคะแนน
    // ตอนนี้ยังไม่รวม Knee Angle
    // -----------------------------
    const totalScore =
        symptomScore +
        bmiScore +
        ageScore;

    console.log("Assessment Data:", data);
    console.log("BMI:", bmi);
    console.log("Symptom Score:", symptomScore);
    console.log("BMI Score:", bmiScore);
    console.log("Age Score:", ageScore);
    console.log("Left Knee Angle:", leftAngle);
    console.log("Right Knee Angle:", rightAngle);
    console.log("Current Risk Score:", totalScore);

    return {
        bmi: Number(bmi.toFixed(2)),
        symptomScore: symptomScore,
        bmiScore: bmiScore,
        ageScore: ageScore,
        leftKneeAngle: leftAngle,
        rightKneeAngle: rightAngle,
        totalScore: totalScore
    };
}
