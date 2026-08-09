/**
 * AI Camera & Pose Detection Module (MediaPipe Pose)
 * Supports: Static Pose Analysis (Knee Alignment / Genu Varum) & Dynamic Sit-to-Stand Test
 */

let camera = null;
let pose = null;
let isScanning = false;
let latestPoseData = {
    leftKneeAngle: 180,
    rightKneeAngle: 180,
    alignmentScore: 0,
    sitToStandCount: 0,
    isSitting: false
};

// ตัวแปรช่วยคำนวณการลุกนั่ง
let sitCount = 0;
let currentState = 'standing'; // 'standing' หรือ 'sitting'

function initAICamera() {
    const videoElement = document.getElementById('webcam');
    const canvasElement = document.getElementById('output-canvas');
    const canvasCtx = canvasElement.getContext('2d');
    const statusText = document.getElementById('camera-status');
    const btnCapture = document.getElementById('btn-capture-scan');

    if (!videoElement || !canvasElement) {
        console.error('Video or Canvas element not found.');
        return;
    }

    statusText.innerText = 'กำลังโหลดโมเดล AI Pose...';
    sitCount = 0;
    latestPoseData.sitToStandCount = 0;

    // ตั้งค่า MediaPipe Pose
    pose = new Pose({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
    });

    pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    pose.onResults((results) => {
        // ปรับขนาด Canvas ให้ตรงกับ Video จริง
        if (videoElement.videoWidth && videoElement.videoHeight) {
            canvasElement.width = videoElement.videoWidth;
            canvasElement.height = videoElement.videoHeight;
        }

        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

        if (results.poseLandmarks) {
            // วาดจุดข้อต่อร่างกาย (Skeleton)
            drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, { color: '#00ffcc', lineWidth: 3 });
            drawLandmarks(canvasCtx, results.poseLandmarks, { color: '#ff0066', lineWidth: 2, radius: 4 });

            // ดึงพิกัดสำคัญ (สะโพก, เข่า, ข้อเท้า ทั้งซ้ายและขวา)
            const landmarks = results.poseLandmarks;
            const leftHip = landmarks[23];
            const leftKnee = landmarks[25];
            const leftAnkle = landmarks[27];
            
            const rightHip = landmarks[24];
            const rightKnee = landmarks[26];
            const rightAnkle = landmarks[28];

            if (leftHip && leftKnee && leftAnkle && rightHip && rightKnee && rightAnkle) {
                // คำนวณมุมข้อเข่าซ้ายและขวา (หน่วยเป็นองศา)
                const leftAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
                const rightAngle = calculateAngle(rightHip, rightKnee, rightAnkle);

                latestPoseData.leftKneeAngle = leftAngle;
                latestPoseData.rightKneeAngle = rightAngle;

                // วิเคราะห์ความเบี่ยงเบนของแนวขา (alignment score เบื้องต้น)
                const avgKneeAngle = (leftAngle + rightAngle) / 2;
                // ถ้าขาตรงปกติ มุมควรอยู่ใกล้ 180 องศา หากงอหรือโก่งมาก มุมจะน้อยลง
                let angleDiff = Math.abs(180 - avgKneeAngle);
                latestPoseData.alignmentScore = Math.max(0, 30 - Math.floor(angleDiff * 0.8));

                // ระบบตรวจจับการลุกนั่ง (Sit-to-Stand Counter อัตโนมัติ)
                // หากมุมเข่าน้อยกว่า 110 องศา ถือว่าท่านั่ง (Sitting) / หากมากกว่า 160 ถือ่ายืน (Standing)
                if (avgKneeAngle < 115 && currentState === 'standing') {
                    currentState = 'sitting';
                    latestPoseData.isSitting = true;
                } else if (avgKneeAngle > 160 && currentState === 'sitting') {
                    currentState = 'standing';
                    sitCount++;
                    latestPoseData.sitToStandCount = sitCount;
                    latestPoseData.isSitting = false;
                }

                statusText.innerHTML = `✅ ตรวจจับโครงสร้างสำเร็จ | มุมเข่าเฉลี่ย: <b>${avgKneeAngle.toFixed(1)}°</b><br>🏋️ ลุกนั่งนับได้: <span style="color: #27ae60; font-size: 1.1rem;"><b>${sitCount}</b></span> ครั้ง`;
                
                if (btnCapture) {
                    btnCapture.removeAttribute('disabled');
                }
            } else {
                statusText.innerText = '⚠️ กรุณายืนถอยหลังให้กล้องเห็นตัวเต็ม (ตั้งแต่หัวจรดเท้า)';
            }
        } else {
            statusText.innerText = '❌ ไม่พบโครงสร้างร่างกาย กรุณาปรับมุมกล้องและแสงสว่าง';
        }

        canvasCtx.restore();
    });

    // เริ่มต้นใช้งานกล้องผ่าน MediaPipe Camera Utils
    if (typeof Camera !== 'undefined') {
        camera = new Camera(videoElement, {
            onFrame: async () => {
                if (isScanning && videoElement) {
                    await pose.send({ image: videoElement });
                }
            },
            width: 640,
            height: 480
        });

        isScanning = true;
        camera.start().then(() => {
            statusText.innerText = '🎥 กล้องพร้อมใช้งาน กรุณายืนตรงหน้ากล้อง';
        }).catch(err => {
            console.error('Camera start error:', err);
            statusText.innerText = '❌ ไม่สามารถเปิดใช้งานกล้องได้ กรุณาตรวจสอบสิทธิ์การเข้าถึง';
        });
    } else {
        console.error('MediaPipe Camera utility is not loaded.');
    }
}

function stopAICamera() {
    isScanning = false;
    if (camera) {
        try {
            camera.stop();
        } catch (e) {
            console.log(e);
        }
        camera = null;
    }
    if (pose) {
        try {
            pose.close();
        } catch (e) {
            console.log(e);
        }
        pose = null;
    }
}

// ฟังก์ชันทางคณิตศาสตร์: คำนวณมุมจาก 3 จุด (Vector Dot Product / Law of Cosines)
function calculateAngle(a, b, c) {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    if (angle > 180.0) {
        angle = 360 - angle;
    }
    return angle;
}
