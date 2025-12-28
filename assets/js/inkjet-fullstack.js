// ======================================================
// Inkjet Full-stack Timing Animation
// V, I, displacement, pressure (ringing emphasized),
// Qout, Qin
// ======================================================

console.log("inkjet-fullstack.js loaded");

const canvas = document.getElementById("inkjetCanvas");
const ctx = canvas.getContext("2d");

const W = canvas.width;
const H = canvas.height;

let t = 0;

// ------------------------------------------------------
// Parameters
// ------------------------------------------------------
const period = 1.0;
const duty = 0.25;
const speed = 0.005;

// ===== 圧力波（教材用に強調）=====
const reflectDelay = 0.08;       // 流路長
const alpha = 2.5;               // 減衰（かなり弱め）
const omega = 2 * Math.PI * 14;  // 高めの共振
const reflectGain1 = 1.0;        // 1次反射（強調）
const reflectGain2 = 0.6;        // 2次反射

// ------------------------------------------------------
// Utility
// ------------------------------------------------------
function frac(x) {
  return ((x % 1) + 1) % 1;
}

// ------------------------------------------------------
// Waveforms
// ------------------------------------------------------
function V(t) {
  return frac(t / period) < duty ? 1 : 0;
}

// I(t) = dV/dt を可視化用に整形
function I(t) {
  const ph = frac(t / period);
  const w = 0.02;

  function tri(x, c) {
    const d = Math.abs(frac(x - c));
    const dd = Math.min(d, 1 - d);
    return Math.max(0, 1 - dd / w);
  }

  return tri(ph, 0.0) - tri(ph, duty);
}

// 変位 Δx
function X(t) {
  return V(t);
}

// ------------------------------------------------------
// 圧力 P(t)：直接波 + 多重反射（減衰振動）
// ------------------------------------------------------
function P(t) {
  const ph = frac(t / period);
  let p = 0;
  const t0 = duty;

  function ring(dt, gain) {
    return gain * Math.exp(-alpha * dt) * Math.sin(omega * dt);
  }

  const dt0 = ph - t0;
  if (dt0 > 0 && dt0 < 1.0) {
    p += -ring(dt0, 1.0);
  }

  const dt1 = ph - (t0 + reflectDelay);
  if (dt1 > 0 && dt1 < 1.0) {
    p += ring(dt1, reflectGain1);
  }

  const dt2 = ph - (t0 + 2 * reflectDelay);
  if (dt2 > 0 && dt2 < 1.0) {
    p += ring(dt2, reflectGain2);
  }

  return p;
}

// 吐出・吸引
function Qout(t) {
  return Math.max(0, P(t));
}

function Qin(t) {
  return Math.max(0, -P(t));
}

// ------------------------------------------------------
// Drawing helpers
// ------------------------------------------------------
function axis(y, label) {
  ctx.strokeStyle = "#bbb";
  ctx.beginPath();
  ctx.moveTo(60, y);
  ctx.lineTo(W - 20, y);
  ctx.stroke();

  ctx.fillStyle = "#000";
  ctx.fillText(label, 10, y + 4);
}

function plot(y0, amp, color, fn) {
  ctx.strokeStyle = color;
  ctx.beginPath();
  for (let i = 0; i <= 800; i++) {
    const tt = i / 800;
    const val = fn(tt + t);
    const x = 60 + i;
    const y = y0 - val * amp;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

// ------------------------------------------------------
// Main loop
// ------------------------------------------------------
function draw() {
  ctx.clearRect(0, 0, W, H);

  axis(80,  "V(t)");
  axis(160, "I(t)");
  axis(240, "Δx(t)");
  axis(320, "P(t)  (ringing visible)");
  axis(400, "Qout");
  axis(460, "Qin");

  plot(80,  40, "red",    V);
  plot(160, 40, "blue",   I);
  plot(240, 40, "green",  X);
  plot(320, 70, "purple", P);   // ← 振幅強調
  plot(400, 40, "orange", Qout);
  plot(460, 40, "brown",  Qin);

  t += speed;
  requestAnimationFrame(draw);
}

draw();
