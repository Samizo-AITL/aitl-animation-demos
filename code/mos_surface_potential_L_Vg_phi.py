# -*- coding: utf-8 -*-
"""
MOS Surface Potential Visualization
Weak inversion → Vth → Strong inversion

Axes:
  x : Channel position L (source → drain) [µm]
  y : Gate voltage Vg [V]
  z : Electrostatic potential φ [V]

Educational model:
  φ(L, Vg) = φ_sd(L) + φ_g(L, Vg)
"""

import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

# -------------------------
# Parameters
# -------------------------
Vd = 3.3
Lch_um = 1.0
lambda_um = 0.18

T = 300.0
k = 1.380649e-23
q = 1.602176634e-19
Vt = k * T / q

Na_cm3 = 1e16
ni_cm3 = 1e10

phi_F = Vt * np.log(Na_cm3 / ni_cm3)
phi_th = 2.0 * phi_F   # threshold criterion

Vg_max = 3.3
Vg_step = 0.3
Vth0 = 0.3   # shape parameter

# -------------------------
# Surface potential model
# -------------------------
def phi_s_of_Vg(Vg):
    return phi_th * np.tanh(Vg / Vth0)

phi_th_mark = 0.99 * phi_th

def find_Vth_marker():
    Vgs = np.linspace(0.0, Vg_max, 2001)
    vals = np.array([phi_s_of_Vg(v) for v in Vgs])
    return Vgs[np.argmin(np.abs(vals - phi_th_mark))]

Vth_marker = find_Vth_marker()

# -------------------------
# Axes grids
# -------------------------
x_um = np.linspace(0.0, Lch_um, 300)
Vg_list = np.round(np.arange(0.0, Vg_max + 1e-9, Vg_step), 1)

X, Y = np.meshgrid(x_um, Vg_list)

# -------------------------
# Potential definition
# -------------------------
def phi_sd(L):
    return Vd * (L / Lch_um)

def phi_g(L, Vg):
    return phi_s_of_Vg(Vg) * np.exp(-L / lambda_um)

Phi = np.zeros_like(X)
for i, Vg in enumerate(Vg_list):
    Phi[i, :] = phi_sd(x_um) + phi_g(x_um, Vg)

phi_s_trace = Phi[:, 0]

# -------------------------
# Plot setup
# -------------------------
fig = plt.figure(figsize=(10, 7))

# ★ 図全体タイトル（ここに集約）
fig.suptitle(
    "MOS Surface Potential  φ(L, Vg)\n"
    "Weak inversion → Threshold → Strong inversion",
    fontsize=14, y=0.96
)

ax = fig.add_subplot(111, projection="3d")

def setup_axes():
    ax.set_xlabel("Channel position L (source → drain) [µm]")
    ax.set_ylabel("Gate voltage Vg [V]")
    ax.set_zlabel("Electrostatic potential φ [V]")

    ax.set_xlim(0.0, Lch_um)
    ax.set_ylim(Vg_list.min(), Vg_list.max())

    zmax = Vd + max(phi_s_trace.max(), phi_th) * 1.05
    ax.set_zlim(0.0, zmax)

    ax.view_init(elev=25, azim=-60)

setup_axes()

# -------------------------
# Animation
# -------------------------
def update(frame):
    ax.cla()
    setup_axes()

    k = frame + 1

    ax.plot_surface(
        X[:k], Y[:k], Phi[:k],
        linewidth=0, alpha=0.85
    )

    # Surface potential φs (L = 0 edge)
    ax.plot(
        np.zeros_like(Vg_list[:k]),
        Vg_list[:k],
        phi_s_trace[:k],
        linewidth=4
    )

    # Threshold reference line φ = 2φF
    Vg_now = float(Vg_list[frame])
    ax.plot(
        x_um,
        np.full_like(x_um, Vg_now),
        np.full_like(x_um, phi_th),
        linewidth=2
    )

    # Vth marker (blue dot) — 不要なら削除OK
    idx_vth = int(np.argmin(np.abs(Vg_list - Vth_marker)))
    ax.scatter(
        [0.0], [Vg_list[idx_vth]], [phi_s_trace[idx_vth]],
        s=60
    )

    # ★ 補足テキスト（少し下に配置）
    ax.text2D(
        0.02, 0.86,
        f"Vg = {Vg_now:.1f} V\n"
        f"Threshold: φs = 2φF = {phi_th:.2f} V\n"
        f"Vth ≈ {Vth_marker:.2f} V\n"
        "Edge (L=0) = surface potential φs",
        transform=ax.transAxes
    )

    return []

ani = FuncAnimation(fig, update, frames=len(Vg_list), interval=350)

# -------------------------
# GIF output
# -------------------------
gif_name = "mos_surface_potential_vth_regions.gif"
ani.save(gif_name, writer="pillow", fps=4)
print(f"GIF saved: {gif_name}")

plt.tight_layout(rect=[0, 0, 1, 0.93])
plt.show()
