// Inkjet Full-stack Animation (Canvas)

const canvas = document.getElementById("inkjetCanvas");
const ctx = canvas.getContext("2d");

let t = 0;

function driveVoltage(t) {
  return t < 0.2 ? 1.0 : 0.0;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 軸
  ctx.strokeStyle = "#888";
  ctx.beginPath();
  ctx.moveTo(50, 250);
  ctx.lineTo(850, 250);
  ctx.stroke();

  // V(t)
  ctx.strokeStyle = "red";
  ctx.beginPath();
  for (let i = 0; i < 800; i++) {
    const tt = i / 800;
    const v = driveVoltage((tt + t) % 1.0);
    ctx.lineTo(50 + i, 250 - v * 80);
  }
  ctx.stroke();

  t += 0.005;
  requestAnimationFrame(draw);
}

draw();
