let webcamVideo = null;

function initAICamera() {
    webcamVideo = document.getElementById('webcam');
    const statusEl = document.getElementById('camera-status');
    
    if (!webcamVideo) return;

    statusEl.innerText = "กำลังเปิดกล้อง...";
    
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
            .then(stream => {
                webcamVideo.srcObject = stream;
                statusEl.innerText = "✅ กล้องพร้อมแล้ว กรุณายืนให้อยู่ในกรอบ";
                statusEl.style.color = "#16a34a";
            })
            .catch(err => {
                console.error("Camera error:", err);
                statusEl.innerText = "⚠️ ไม่สามารถเปิดกล้องได้ กรุณาอนุญาตการใช้งานกล้อง";
                statusEl.style.color = "#dc2626";
            });
    }
}

function startAIAnalysisProcess() {
    switchScreen('analyzing-screen');
    
    let progressBar = document.getElementById('progress-bar');
    let statusText = document.getElementById('analyzing-status-text');
    let progress = 0;

    let interval = setInterval(() => {
        progress += 25;
        if (progressBar) progressBar.style.width = progress + '%';

        if (progress === 25) {
            document.getElementById('step-1').style.color = "#16a34a";
            document.getElementById('step-1').innerText = "✔ ตรวจจับจุดข้อต่อสำเร็จ";
        } else if (progress === 50) {
            document.getElementById('step-2').style.color = "#16a34a";
            document.getElementById('step-2').innerText = "✔ วิเคราะห์มุมกระดูกและขาโก่งสำเร็จ";
        } else if (progress === 75) {
            document.getElementById('step-3').style.color = "#16a34a";
            document.getElementById('step-3').innerText = "✔ วิเคราะห์มุมยุบตัวของข้อเข่าสำเร็จ";
        } else if (progress === 100) {
            clearInterval(interval);
            statusText.innerText = "ประมวลผลสำเร็จ กำลังแสดงผลรายงาน...";
            setTimeout(() => {
                switchScreen('result-screen');
            }, 800);
        }
    }, 600);
}
