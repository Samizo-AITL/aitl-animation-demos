console.log("FSM visualizer loaded");

// =====================================
// FSM transition table (definition)
// =====================================
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

let currentState = "IDLE";

// =====================================
// SVG coordinates (viewBox based)
// =====================================
const POS = {
  IDLE_X: 200,
  RUN_X: 400,
  Y: 180
};

const EVENT_SPEED = 5;
const EVENT_INTERVAL = 20;

// =====================================
// DOM ready
// =====================================
window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("button[data-event]").forEach(btn => {
    btn.addEventListener("click", () => {
      dispatch(btn.dataset.event);
    });
  });
});

// =====================================
// FSM dispatcher
// =====================================
function dispatch(event) {
  const next = FSM[currentState]?.[event];

  clearTableHighlight();

  if (!next) {
    rejectEvent();
    console.log("Rejected event:", event, "in state:", currentState);
    return;
  }

  highlightTable(currentState, event);
  animateEvent(next);
}

// =====================================
// Animation: event token movement
// =====================================
function animateEvent(nextState) {
  const e = document.getElementById("event");

  e.setAttribute("visibility", "visible");
  e.setAttribute("fill", "#ffcc00");
  e.setAttribute("cx", POS.IDLE_X);
  e.setAttribute("cy", POS.Y);

  let x = POS.IDLE_X;

  const timer = setInterval(() => {
    x += EVENT_SPEED;
    e.setAttribute("cx", x);

    if (x >= POS.RUN_X) {
      clearInterval(timer);
      e.setAttribute("visibility", "hidden");
      transitionTo(nextState);
    }
  }, EVENT_INTERVAL);
}

// =====================================
// State transition
// =====================================
function transitionTo(nextState) {
  document.getElementById(currentState)
    .classList.remove("active");

  document.getElementById(nextState)
    .classList.add("active");

  currentState = nextState;
  console.log("FSM state =", currentState);
}

// =====================================
// Reject visualization (invalid event)
// =====================================
function rejectEvent() {
  const e = document.getElementById("event");

  e.setAttribute("visibility", "visible");
  e.setAttribute("fill", "#ff4444");
  e.setAttribute("cx", POS.IDLE_X);
  e.setAttribute("cy", POS.Y);

  setTimeout(() => {
    e.setAttribute("visibility", "hidden");
    e.setAttribute("fill", "#ffcc00");
  }, 300);
}

// =====================================
// Transition table highlight
// =====================================
function clearTableHighlight() {
  document.querySelectorAll(".highlight")
    .forEach(td => td.classList.remove("highlight"));
}

function highlightTable(state, event) {
  const table = document.getElementById("fsmTable");
  if (!table) return;

  const rows = [...table.rows];
  const header = rows[0];
  const stateRow = rows.find(r => r.cells[0]?.innerText === state);
  if (!stateRow) return;

  const colIndex = [...header.cells]
    .findIndex(h => h.innerText === event);

  if (colIndex > 0) {
    stateRow.cells[colIndex].classList.add("highlight");
  }
}
