---
title: "【Anim】Animation Demosで理解する三層制御アーキテクチャの可視化"
emoji: "🎞️"
type: "tech"
topics: ["aitl", "制御理論", "visualization", "css", "svg", "canvas"]
published: true
---

※本記事は、**制御・アーキテクチャ・教育用途における「概念可視化」**に関心のあるエンジニア向けです。

---

## はじめに ― なぜ「動かす」のか

制御理論やアーキテクチャ設計では、

- 数式は正しいが直感が育たない
- 図は理解できるが動きが見えない
- 実装は追えるが全体像を失いやすい

という問題が頻発します。

そこで本記事では、  
👉 https://samizo-aitl.github.io/aitl-animation-demos/  
で公開している **Animation Demos** を題材に、

- 制御構造
- 状態遷移
- 物理的挙動

を **アニメーションで理解する設計アプローチ** を解説します。

---

## AITL（三層制御アーキテクチャ）概要

AITLは、以下の三層構造を基本思想としています。

```
LLM（再設計・戦略層）
 └ FSM（状態監督・モード遷移）
    └ PID（実時間制御ループ）
```

### 各層の役割

- **PID**  
  実時間制御。電圧‐電流（V–I）応答を含む安定性と追従性を担保。
- **FSM**  
  状態・モード・異常遷移を管理。
- **LLM**  
  性能劣化や故障時に、PID再同定やFSMルール再設計を行う。

Animation Demos は、この **階層構造と役割分担を視覚的に共有するための補助輪** です。

---

## Animation Demos の構成

### ① CSS Animation Demos

- Orbit / Fade-in / Pulse
- Layer Stack 表現

**狙い**
- 制御ループの周期性
- 階層構造の重なり
- 影響度の強弱

---

### ② SVG + JavaScript Demos

- AITL制御フロー
- FSM状態遷移
- インクジェット吐出モデル

**狙い**
- 状態と遷移の明示
- 因果関係の可視化
- 制御権の移動表現

---

### ③ Canvas Demos

- 粒子運動
- 簡易物理シミュレーション

**狙い**
- 連続系ダイナミクスの直感理解
- 数式以前の挙動把握

---

### ④ 半導体・物理系アニメーション

- pn接合の電位分布
- MOS / NMOS 表面ポテンシャル

**狙い**
- V–I特性と物理現象の接続
- 制御対象そのものの理解

---

## 実装例①：CSS Pulse アニメーション

```css
.pulse {
  animation: pulseAnim 1.5s infinite ease-in-out;
}

@keyframes pulseAnim {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.6;
  }
}
```

### 制御的な意味づけ

- **周期**：制御ループ周期
- **振幅**：ゲイン変動
- **透明度**：影響度・重み

PIDの応答を、数式ではなく **「揺れ」として理解**できます。

---

## 実装例②：SVG による FSM 可視化

```js
const svg = document.querySelector("svg");

function addNode(x, y) {
  const c = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  c.setAttribute("cx", x);
  c.setAttribute("cy", y);
  c.setAttribute("r", 18);
  svg.appendChild(c);
}
```

### FSMとの対応関係

- ノード：状態
- エッジ：遷移条件
- アニメーション：制御権の移動

**静止図だったFSMが、動的モデルに変わります。**

---

## なぜアニメーションが有効なのか

- 数式：正確だが理解が遅い
- 図：理解できるが静的
- アニメ：多少曖昧だが理解が速い

設計初期・教育・議論フェーズでは、

- 速い理解
- 共通イメージの共有
- 認知負荷の低減

が重要です。

Animation Demos は、  
**数式・SPICE・FEMに入る前段の知的ウォームアップ** として機能します。

---

## AITLとアニメーションの対応関係

| レイヤ | アニメで表現されるもの |
|------|--------------------|
| PID | 振動・追従・収束 |
| FSM | 状態遷移・モード切替 |
| LLM | 再構成・分岐判断 |

アニメーションは装飾ではありません。  
**設計思考を共有するための、最も軽量なモデル**です。

---

## まとめ

- Animation Demos は AITL理解の補助輪
- CSS / SVG / Canvas は設計教育に強力
- 「動かす」ことで構造が見える
- 数式・コード・物理への橋渡しになる

👉 デモ集はこちら  
https://samizo-aitl.github.io/aitl-animation-demos/

---

## 次の展開

- PID / FSM / LLM 各層の単独解説
- デモ単体の深掘り記事
- 教育・設計テンプレート化

順次公開予定です。

---

> アニメーションは装飾ではない。  
> 設計思考を共有するための、最も軽量なモデルである。
