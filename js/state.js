/**
 * Global State Management
 */
const appState = {
    currentStep: 'home-screen',
    patientInfo: {
        age: null,
        gender: '',
        weight: null,
        height: null,
        isConsented: false
    },
    questionnaire: {
        answers: [],
        isCompleted: false
    },
    risk: {
        symptomScore: 0,
        bmiScore: 0,
        poseScore: 0,
        ageScore: 0,
        totalScore: 0,
        riskLevel: null
    }
};

function setCurrentStep(stepId) {
    appState.currentStep = stepId;
}

function updatePatientInfo(info) {
    appState.patientInfo = { ...appState.patientInfo, ...info };
}

function updateQuestionnaireAnswers(answers, isCompleted) {
    appState.questionnaire.answers = answers;
    appState.questionnaire.isCompleted = isCompleted;
}

function updateRiskResults(riskData) {
    appState.risk = { ...appState.risk, ...riskData };
}

function getState() {
    return appState;
}
