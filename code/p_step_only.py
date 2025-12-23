import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

# =========================
# 時間設定
# =========================
dt = 0.01
T  = 6.0
t = np.arange(0, T, dt)

# =========================
# 目標値（電流 I_ref）
# =========================
Iref = np.ones_like(t)
Iref[t < 0.5] = 0.0

# =========================
# プラント（2次系）
# x'' + 2*zeta*wn*x' + wn^2*x = K*u
# 出力 I = x
# =========================
wn   = 3.0
zeta = 0.25
Kp_plant = 1.0

# =========================
# Pゲイン（比較用）
# =========================
Kp_list = [1.5, 5.0, 12.0]
labels  = ["Kp low", "Kp typ", "Kp high"]
colors  = ["tab:blue", "tab:green", "tab:red"]

# =========================
# シミュレーション
# =========================
def simulate_p(Kp):
    x, xdot = 0.0, 0.0
    I = []

    for k in range(len(t)):
        e = Iref[k] - x
        u = Kp * e

        xdd = Kp_plant * u - 2*zeta*wn*xdot - wn**2 * x
        xdot += xdd * dt
        x    += xdot * dt
        I.append(x)

    return np.array(I)

responses = [simulate_p(Kp) for Kp in Kp_list]

# =========================
# アニメーション描画
# =========================
fig, ax = plt.subplots(figsize=(8, 4))
ax.set_xlim(0, T)
ax.set_ylim(-0.5, 2.0)
ax.set_xlabel("time [s]")
ax.set_ylabel("I (output)")
ax.set_title("P control step response")

ax.plot(t, Iref, "k--", label="I_ref")

lines = []
for c, lab in zip(colors, labels):
    ln, = ax.plot([], [], lw=2, color=c, label=lab)
    lines.append(ln)

ax.legend()

def update(frame):
    for i, ln in enumerate(lines):
        ln.set_data(t[:frame], responses[i][:frame])
    return lines

ani = FuncAnimation(fig, update, frames=len(t), interval=20)

# =========================
# 保存
# =========================
ani.save("p_step_only.gif", writer="pillow", fps=30)
plt.close()

print("Saved: p_step_only.gif")
