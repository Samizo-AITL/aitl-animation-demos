// FSM Visualizer (Event-Driven)
// ----------------------------

console.log("FSM visualizer loaded");

// current FSM state
let current = "IDLE";

// wait until DOM is ready (important for iframe + GitHub Pages)
window.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startBtn");
  if (startBtn) {
    startBtn.addEventListener("click", sendEvent);
  } else {
    console.error("START button not found");
  }
});

// send START event
function sendEvent() {
  // START is valid only in IDLE
  if (current !== "IDLE") {
    rejectEvent();
    return;
  }

  const e = document.getElementById("event");
  e.setAttribute("visibility", "visible");
  e.setAttribute("cx", 200);

  let x = 200;
  const timer = setInterval(() => {
    x += 5;
    e.setAttribute("cx", x);

    if (x >= 400) {
      clearInterval(timer);
      e.setAttribute("visibility", "hidden");
      transitionTo("RUN");
    }
  }, 20);
}

// state transition
function transitionTo(next) {
  const currentNode = document.getElementById(current);
  const nextNode = document.getElementById(next);

  if (currentNode) currentNode.classList.remove("active");
  if (nextNode) nextNode.classList.add("active");

  current = next;
  console.log("FSM state changed to:", current);
}

// visual rejection for invalid events
function rejectEvent() {
  const e = document.getElementById("event");
  e.setAttribute("visibility", "visible");
  e.setAttribute("cx", 200);
  e.setAttribute("fill", "#ff4444"); // red = rejected

  setTimeout(() => {
    e.setAttribute("visibility", "hidden");
    e.setAttribute("fill", "#ffcc00"); // restore color
  }, 300);

  console.log("Event rejected in state:", current);
}
