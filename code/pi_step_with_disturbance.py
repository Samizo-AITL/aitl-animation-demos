import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

# =========================
# 時間設定
# =========================
dt = 0.01
T  = 8.0
t = np.arange(0, T, dt)

# =========================
# 目標値（電流 I_ref）
# =========================
Iref = np.ones_like(t)
Iref[t < 0.5] = 0.0

# =========================
# 外乱（一定オフセット）
# =========================
dist = np.zeros_like(t)
dist[t > 3.0] = 0.6   # 3秒で外乱投入

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

# =========================
# P制御
# =========================
def simulate_p():
    x, xdot = 0.0, 0.0
    I = []

    for k in range(len(t)):
        e = Iref[k] - x
        u = Kp * e

        xdd = Kplant*u + dist[k] - 2*zeta*wn*xdot - wn**2*x
        xdot += xdd * dt
        x    += xdot * dt
        I.append(x)

    return np.array(I)

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
        u = Kp * e + Ki * integ

        xdd = Kplant*u + dist[k] - 2*zeta*wn*xdot - wn**2*x
        xdot += xdd * dt
        x    += xdot * dt
        I.append(x)

    return np.array(I)

I_p  = simulate_p()
I_pi = simulate_pi()

# =========================
# アニメーション描画
# =========================
fig, ax = plt.subplots(figsize=(8, 4))
ax.set_xlim(0, T)
ax.set_ylim(-0.5, 2.0)
ax.set_xlabel("time [s]")
ax.set_ylabel("I (output)")
ax.set_title("P vs PI control (step + disturbance)")

ax.plot(t, Iref, "k--", label="I_ref")
ax.axvline(3.0, color="k", lw=1)
ax.text(3.05, 1.6, "disturbance", fontsize=9)

line_p,  = ax.plot([], [], lw=2, color="tab:blue", label="P control")
line_pi, = ax.plot([], [], lw=2, color="tab:red",  label="PI control")
ax.legend()

def update(frame):
    line_p.set_data(t[:frame],  I_p[:frame])
    line_pi.set_data(t[:frame], I_pi[:frame])
    return line_p, line_pi

ani = FuncAnimation(fig, update, frames=len(t), interval=20)

# =========================
# 保存
# =========================
ani.save("pi_step_disturbance.gif", writer="pillow", fps=30)
plt.close()

print("Saved: pi_step_disturbance.gif")
