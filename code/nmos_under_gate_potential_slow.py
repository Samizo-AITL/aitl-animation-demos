import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation, PillowWriter
import os

# =========================
# 電圧条件（物理定義）
# =========================
Vg_max = 3.3        # ゲート最大電圧 [V]
Vs = 0.0            # Source 電圧 [V]
Vd = 3.3            # Drain 電圧 [V]

alpha = 0.6         # ゲート誘起係数（教材用）

# φ の理論最大値と表示上限
PHI_MAX = Vd + alpha * Vg_max     # ≈ 5.28 V
ZMAX = 5.2                        # 表示用（少しマージン）

fps = 5
frames = 120

# =========================
# ゲート電圧（三角波・完全連続）
# =========================
t = np.linspace(0, 1, frames, endpoint=False)

def triangle_wave(t):
    return Vg_max * (1.0 - np.abs(2.0 * t - 1.0))

Vg_cycle = triangle_wave(t)

# =========================
# 座標系
#   手前: L = 0 µm (Source)
#   奥  : L = 5 µm (Drain)
# =========================
L_calc = np.linspace(0, 5, 50)
W = np.linspace(0, 10, 50)

Xc, Y = np.meshgrid(L_calc, W)

# 表示用 L（手前=0, 奥=5 にするため反転）
L_plot = L_calc.max() - L_calc
Xp, _ = np.meshgrid(L_plot, W)

# =========================
# チャネル電位モデル
# =========================
def potential_function(X, Y, Vg):
    """
    φ(x,y) = φ_SD(x) + φ_gate(x,y)

    φ_SD(0) = Vs
    φ_SD(L) = Vd

    φ_max ≈ Vd + alpha * Vg_max
    """

    # Source → Drain 線形電位
    phi_sd = Vs + (Vd - Vs) * (X / X.max())

    # ゲート誘起電位（最大 alpha*Vg）
    phi_gate = (
        alpha * Vg
        * (1.0 - np.exp(-X / 1.5))
        * (0.6 + 0.4 * Y / Y.max())
    )

    return phi_sd + phi_gate

# =========================
# 描画
# =========================
fig = plt.figure(figsize=(6, 4))
ax = fig.add_subplot(111, projection="3d")

def update(frame):
    Vg = Vg_cycle[frame]
    Z = potential_function(Xc, Y, Vg)

    ax.clear()

    ax.plot_surface(
        Xp, Y, Z,
        cmap="viridis",
        vmin=0.0,
        vmax=ZMAX
    )

    # 軸固定（重要）
    ax.set_xlim(0, 5)
    ax.set_ylim(0, 10)
    ax.set_zlim(0, ZMAX)

    # L/W/Z の物理スケール反映
    ax.set_box_aspect((5, 10, ZMAX))

    ax.set_xlabel("L (µm)")
    ax.set_ylabel("W (µm)")
    ax.set_zlabel("φ (V)")
    ax.set_title(
        f"NMOS channel potential\n"
        f"Vg = {Vg:.2f} V,  Vs = {Vs:.1f} V,  Vd = {Vd:.1f} V"
    )

    ax.view_init(elev=25, azim=-60)

    return []

ani = FuncAnimation(
    fig,
    update,
    frames=len(Vg_cycle),
    interval=1000 // fps,
    repeat=True
)

# =========================
# GIF 保存
# =========================
os.makedirs("assets/images", exist_ok=True)
gif_path = "assets/images/nmos_under_gate_potential_slow.gif"

ani.save(
    gif_path,
    writer=PillowWriter(fps=fps)
)
