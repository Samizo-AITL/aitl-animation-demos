// FSM Visualizer (Event-Driven)

console.log("FSM visualizer loaded");

// FSM state
let current = "IDLE";

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("startBtn")
    .addEventListener("click", sendStart);

  document.getElementById("resetBtn")
    .addEventListener("click", resetFSM);
});

// START event
function sendStart() {
  if (current !== "IDLE") {
    rejectEvent();
    return;
  }
  animateEvent("RUN");
}

// RESET event (external / supervisory)
function resetFSM() {
  transitionTo("IDLE");
}

// event animation
function animateEvent(next) {
  const e = document.getElementById("event");
  e.setAttribute("visibility", "visible");
  e.setAttribute("fill", "#ffcc00");
  e.setAttribute("cx", 200);

  let x = 200;
  const timer = setInterval(() => {
    x += 5;
    e.setAttribute("cx", x);

    if (x >= 400) {
      clearInterval(timer);
      e.setAttribute("visibility", "hidden");
      transitionTo(next);
    }
  }, 20);
}

// state transition
function transitionTo(next) {
  document.getElementById(current).classList.remove("active");
  document.getElementById(next).classList.add("active");
  current = next;
  console.log("FSM state:", current);
}

// rejected event visualization
function rejectEvent() {
  const e = document.getElementById("event");
  e.setAttribute("visibility", "visible");
  e.setAttribute("fill", "#ff4444");
  e.setAttribute("cx", 200);

  setTimeout(() => {
    e.setAttribute("visibility", "hidden");
    e.setAttribute("fill", "#ffcc00");
  }, 300);

  console.log("Event rejected in state:", current);
}
