console.log("FSM visualizer loaded");

// -----------------------------
// FSM transition table
// -----------------------------
const FSM = {
  IDLE: {
    START: "RUN",
    RESET: "IDLE"
  },
  RUN: {
    STOP: "IDLE",
    RESET: "IDLE"
  }
};

let current = "IDLE";

// -----------------------------
// DOM ready
// -----------------------------
window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("button[data-event]").forEach(btn => {
    btn.addEventListener("click", () => {
      dispatch(btn.dataset.event);
    });
  });
});

// -----------------------------
// FSM dispatcher
// -----------------------------
function dispatch(event) {
  const next = FSM[current]?.[event];

  if (!next) {
    rejectEvent();
    return;
  }

  animateEvent(next);
  highlightTable(current, event);
}

// -----------------------------
// Animation
// -----------------------------
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

function transitionTo(next) {
  document.getElementById(current).classList.remove("active");
  document.getElementById(next).classList.add("active");
  current = next;
  console.log("FSM state =", current);
}

// -----------------------------
// Reject visualization
// -----------------------------
function rejectEvent() {
  const e = document.getElementById("event");
  e.setAttribute("visibility", "visible");
  e.setAttribute("fill", "#ff4444");

  setTimeout(() => {
    e.setAttribute("visibility", "hidden");
    e.setAttribute("fill", "#ffcc00");
  }, 300);

  console.log("Rejected event in state:", current);
}

// -----------------------------
// Transition table highlight
// -----------------------------
function highlightTable(state, event) {
  document.querySelectorAll(".highlight")
    .forEach(td => td.classList.remove("highlight"));

  const table = document.getElementById("fsmTable");
  const stateRow = [...table.rows]
    .find(r => r.cells[0]?.innerText === state);

  if (!stateRow) return;

  const headers = [...table.rows[0].cells];
  const col = headers.findIndex(h => h.innerText === event);

  if (col > 0) {
    stateRow.cells[col].classList.add("highlight");
  }
}
