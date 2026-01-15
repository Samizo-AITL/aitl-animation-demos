let current = "IDLE";

function sendEvent() {
  if (current !== "IDLE") return;

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

function transitionTo(next) {
  document.getElementById(current).classList.remove("active");
  document.getElementById(next).classList.add("active");
  current = next;
}
