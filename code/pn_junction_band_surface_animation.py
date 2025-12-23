# -*- coding: utf-8 -*-
"""
pn junction band energy surface animation (depletion approximation)
- 横軸: p → n（位置 x）
- 奥行軸: 印加バイアス Va（+3.3 → -3.3 V）
- z軸: エネルギー [eV]（相対）

※ フェルミ準位は描かない（視認性優先）
※ 実行すると必ず GIF を出力します

要件:
  pip install numpy matplotlib pillow
"""

import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

# -------------------------
# 物理定数・材料定数（Si想定）
# -------------------------
q = 1.602176634e-19
k = 1.380649e-23
T = 300.0
Vt = k * T / q
eps0 = 8.8541878128e-12
eps_si = 11.7 * eps0
ni_cm3 = 1.0e10
Eg = 1.12  # [eV]

# -------------------------
# ドーピング
# -------------------------
Na_cm3 = 1e16
Nd_cm3 = 1e16
Na = Na_cm3 * 1e6
Nd = Nd_cm3 * 1e6
ni = ni_cm3 * 1e6

# 内蔵電位
Vbi = Vt * np.log((Na * Nd) / (ni ** 2))

# -------------------------
# 空間軸
# -------------------------
L_um = 2.0
x_um = np.linspace(-L_um, L_um, 401)
x = x_um * 1e-6

# -------------------------
# バイアス軸
# -------------------------
Va_list = np.round(np.arange(3.3, -3.3 - 1e-9, -0.3), 1)
Nv = len(Va_list)

# -------------------------
# 空乏近似による電位分布
# -------------------------
def phi_profile(Va):
    Vj = max(Vbi - Va, 1e-6)

    W = np.sqrt(2 * eps_si / q * Vj * (1 / Na + 1 / Nd))
    Wp = W * Nd / (Na + Nd)
    Wn = W * Na / (Na + Nd)

    phi = np.zeros_like(x)

    mask_p = (x >= -Wp) & (x <= 0)
    phi[mask_p] = (q * Na / (2 * eps_si)) * (x[mask_p] + Wp) ** 2

    mask_n = (x >= 0) & (x <= Wn)
    phi[mask_n] = Vj - (q * Nd / (2 * eps_si)) * (Wn - x[mask_n]) ** 2

    phi[x > Wn] = Vj
    return phi, Vj

# -------------------------
# エネルギー面計算
# -------------------------
Ec = np.zeros((Nv, x.size))
Ev = np.zeros((Nv, x.size))
Vj_list = np.zeros(Nv)

for i, Va in enumerate(Va_list):
    phi, Vj = phi_profile(Va)
    Vj_list[i] = Vj
    Ec[i, :] = -phi
    Ev[i, :] = Ec[i, :] - Eg

X, Y = np.meshgrid(x_um, Va_list)
Zc, Zv = Ec, Ev

# -------------------------
# 描画設定
# -------------------------
fig = plt.figure(figsize=(10, 7))
ax = fig.add_subplot(111, projection="3d")

def setup_axes():
    ax.set_title("pn junction band energy surface (depletion approx.)")
    ax.set_xlabel("Position x (p → n) [µm]")
    ax.set_ylabel("Applied bias Va [V] (forward → equilibrium → reverse)")
    ax.set_zlabel("Energy [eV] (relative)")
    ax.view_init(elev=25, azim=-60)
    ax.set_xlim(x_um.min(), x_um.max())
    ax.set_ylim(Va_list.min(), Va_list.max())
    ax.set_zlim(Zv.min(), Zc.max())

setup_axes()

# -------------------------
# アニメ更新
# -------------------------
def update(frame):
    ax.cla()
    setup_axes()

    k = frame + 1
    ax.plot_surface(X[:k], Y[:k], Zc[:k], alpha=0.85, linewidth=0)
    ax.plot_surface(X[:k], Y[:k], Zv[:k], alpha=0.35, linewidth=0)

    ax.text2D(
        0.02, 0.95,
        f"Va = {Va_list[frame]:+.1f} V   (Vj ≈ {Vj_list[frame]:.2f} V, Vbi ≈ {Vbi:.2f} V)",
        transform=ax.transAxes
    )

ani = FuncAnimation(fig, update, frames=Nv, interval=200)

# -------------------------
# GIF出力（必ず実行）
# -------------------------
gif_name = "pn_band_energy_surface.gif"
ani.save(gif_name, writer="pillow", fps=5)
print(f"GIF saved: {gif_name}")

plt.show()
