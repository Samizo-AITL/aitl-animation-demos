// Inkjet Full-stack Animation (Canvas) - V(t) & I(t)

const canvas = document.getElementById("inkjetCanvas");
const ctx = canvas.getContext("2d");

let t = 0;
const period = 1.0;
const duty = 0.25;

function frac(x) {
  return ((x % 1) + 1) % 1;
}

function V(t) {
  return frac(t / period) < duty ? 1 : 0;
}

// I(t) は「立上り・立下りの近傍だけ」スパイクを描く（見えるように整形）
// 立上り：+1、立下り：-1、幅 w の三角パルス
function I_shaped(t) {
  const ph = frac(t / period);           // 0..1
  const w = 0.01;                        // スパイク幅（見えるように）
  const rise = 0.0;                      // 立上り位相
  const fall = duty;                     // 立下り位相

  function triPulse(x, center) {
    const d = Math.abs(frac(x - center));
    const dd = Math.min(d, 1 - d);       // wrap距離
    const a = 1 - (dd / w);
    return Math.max(0, a);
  }

  const ir = triPulse(ph, rise); // 0..1
  const ifa = triPulse(ph, fall); // 0..1
  return ir - ifa; // +（立上り） / -（立下り）
}

function drawAxis(y, label) {
  ctx.strokeStyle = "#ccc";
  ctx.beginPath();
  ctx.moveTo(50, y);
  ctx.lineTo(850, y);
  ctx.stroke();
  ctx.fillStyle = "#000";
  ctx.fillText(label, 10, y + 5);
}

function plotWave(y0, amp, color, fn) {
  ctx.strokeStyle = color;
  ctx.beginPath();
  for (let i = 0; i <= 800; i++) {
    const tt = i / 800;           // 0..1
    const val = fn(tt + t);       // waveform
    const x = 50 + i;
    const y = y0 - val * amp;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 軸
  drawAxis(200, "V(t)");
  drawAxis(350, "I(t)  (shaped)");

  // 波形
  plotWave(200, 80, "red", (x) => V(x));
  plotWave(350, 80, "blue", (x) => I_shaped(x)); // ←青が必ず見える

  // 時間更新
  t += 0.003;
  requestAnimationFrame(draw);
}

draw();
