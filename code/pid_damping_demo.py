import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

# =========================
# 時間
# =========================
dt = 0.01
T  = 6.0
t = np.arange(0, T, dt)

# =========================
# 目標値
# =========================
Iref = np.ones_like(t)
Iref[t < 0.5] = 0.0

# =========================
# プラント（2次系）
# =========================
wn   = 3.0
zeta = 0.25
Kplant = 1.0

# =========================
# ゲイン
# =========================
Kp = 5.0
Ki = 1.5
Kd = 1.2   # ← Dだけ追加

# =========================
# PI制御
# =========================
def simulate_pi():
    x, xdot = 0.0, 0.0
    integ = 0.0
    I = []

    for k in range(len(t)):
        e = Iref[k] - x
        integ += e * dt
        u = Kp*e + Ki*integ

        xdd = Kplant*u - 2*zeta*wn*xdot - wn**2*x
        xdot += xdd * dt
        x    += xdot * dt
        I.append(x)

    return np.array(I)

# =========================
# PID制御（Dは速度を見る）
# =========================
def simulate_pid():
    x, xdot = 0.0, 0.0
    integ = 0.0
    I = []

    for k in range(len(t)):
        e = Iref[k] - x
        integ += e * dt
        u = Kp*e + Ki*integ - Kd*xdot   # ← D項

        xdd = Kplant*u - 2*zeta*wn*xdot - wn**2*x
        xdot += xdd * dt
        x    += xdot * dt
        I.append(x)

    return np.array(I)

I_pi  = simulate_pi()
I_pid = simulate_pid()

# =========================
# 描画
# =========================
fig, ax = plt.subplots(figsize=(8,4))
ax.set_xlim(0, T)
ax.set_ylim(-0.5, 2.0)
ax.set_xlabel("time [s]")
ax.set_ylabel("I (output)")
ax.set_title("PI vs PID (D suppresses oscillation)")

ax.plot(t, Iref, "k--", label="I_ref")
line_pi,  = ax.plot([], [], lw=2, color="tab:blue", label="PI")
line_pid, = ax.plot([], [], lw=2, color="tab:red",  label="PID")
ax.legend()

def update(frame):
    line_pi.set_data(t[:frame],  I_pi[:frame])
    line_pid.set_data(t[:frame], I_pid[:frame])
    return line_pi, line_pid

ani = FuncAnimation(fig, update, frames=len(t), interval=20)

ani.save("pid_damping.gif", writer="pillow", fps=30)
plt.close()

print("Saved: pid_damping.gif")
