// ======================================================
// Inkjet Full-stack Timing Animation
// V, I, displacement, pressure(with reflection), Qout, Qin
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

// 圧力波パラメータ（物理意味あり）
const reflectDelay = 0.08;     // 流路長（反射遅延）
const alpha = 10.0;            // 減衰（粘性）
const omega = 2 * Math.PI * 6; // 共振周波数
const reflectGain = 0.6;       // 反射係数

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

// 見えるように整形した I(t)（dV/dt相当）
function I(t) {
  const ph = frac(t / period);
  const w = 0.02;

  function tri(x, c) {
    const d = Math.abs(frac(x - c));
    const dd = Math.min(d, 1 - d);
    return Math.max(0, 1 - dd / w);
  }

  // 立上り＋ / 立下り−
  return tri(ph, 0.0) - tri(ph, duty);
}

// 変位 Δx（電圧追従）
function X(t) {
  return V(t);
}

// ------------------------------------------------------
// 圧力 P(t)：直接波 + 反射波（減衰振動）
// ------------------------------------------------------
function P(t) {
  const ph = frac(t / period);
  let p = 0;

  // イベント：立下り（吐出後）
  const t0 = duty;

  // --- 直接波 ---
  const dt0 = ph - t0;
  if (dt0 > 0 && dt0 < 0.4) {
    p += -Math.exp(-alpha * dt0) * Math.sin(omega * dt0);
  }

  // --- 反射波 ---
  const dt1 = ph - (t0 + reflectDelay);
  if (dt1 > 0 && dt1 < 0.4) {
    p += reflectGain * Math.exp(-alpha * dt1) * Math.sin(omega * dt1);
  }

  return p;
}

// 吐出・吸引（符号で分離）
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

  // Axes
  axis(80,  "V(t)");
  axis(160, "I(t)");
  axis(240, "Δx(t)");
  axis(320, "P(t)  (with reflection)");
  axis(400, "Qout");
  axis(460, "Qin");

  // Waves
  plot(80,  40, "red",    V);
  plot(160, 40, "blue",   I);
  plot(240, 40, "green",  X);
  plot(320, 40, "purple", P);
  plot(400, 40, "orange", Qout);
  plot(460, 40, "brown",  Qin);

  t += speed;
  requestAnimationFrame(draw);
}

draw();
