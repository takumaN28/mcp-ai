---
title: ScrollTriggerでend位置がズレる問題
slug: scroll-bug
tags:
  - gsap
  - scrolltrigger
  - resize
created: 2025-07-09
---

ScrollTriggerを使っていて、リサイズ時にend位置がずれる問題が発生。

## 原因
- DOMの高さ変動によりScrollTriggerのキャッシュが狂う

## 解決策
- `ScrollTrigger.refresh()` を `resize` イベントで呼び出すことで修正可能