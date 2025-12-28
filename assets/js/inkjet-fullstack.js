// ======================================================
// Inkjet Full-stack Timing Animation (Guaranteed Working)
// V, I, displacement, pressure, Qout, Qin
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

// 見えるように整形した I(t)
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

// 圧力 P（変位の時間変化）
function P(t) {
  return I(t);
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
  axis(320, "P(t)");
  axis(400, "Qout");
  axis(460, "Qin");

  // Waves
  plot(80,  40, "red",   V);
  plot(160, 40, "blue",  I);
  plot(240, 40, "green", X);
  plot(320, 40, "purple",P);
  plot(400, 40, "orange",Qout);
  plot(460, 40, "brown", Qin);

  t += speed;
  requestAnimationFrame(draw);
}

draw();
