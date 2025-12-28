// Inkjet Full-stack Animation (Canvas)

const canvas = document.getElementById("inkjetCanvas");
const ctx = canvas.getContext("2d");

let t = 0;
const dt = 0.005;

// --- Waveforms ---
function driveVoltage(t) {
  return (t % 1.0) < 0.25 ? 1.0 : 0.0;
}

function driveCurrent(t) {
  const v1 = driveVoltage(t);
  const v0 = driveVoltage(t - dt);
  return (v1 - v0) / dt; // dV/dt
}

// --- Draw ---
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 基準線
  ctx.strokeStyle = "#ccc";
  ctx.beginPath();
  ctx.moveTo(50, 200); ctx.lineTo(850, 200); // V
  ctx.moveTo(50, 350); ctx.lineTo(850, 350); // I
  ctx.stroke();

  // V(t)
  ctx.strokeStyle = "red";
  ctx.beginPath();
  for (let i = 0; i < 800; i++) {
    const tt = i / 800;
    const v = driveVoltage(tt + t);
    ctx.lineTo(50 + i, 200 - v * 80);
  }
  ctx.stroke();

  // I(t)
  ctx.strokeStyle = "blue";
  ctx.beginPath();
  for (let i = 0; i < 800; i++) {
    const tt = i / 800;
    const I = driveCurrent(tt + t);
    ctx.lineTo(50 + i, 350 - I * 5);
  }
  ctx.stroke();

  // ラベル
  ctx.fillStyle = "#000";
  ctx.fillText("V(t)", 10, 200);
  ctx.fillText("I(t)", 10, 350);

  t += dt;
  requestAnimationFrame(draw);
}

draw();
