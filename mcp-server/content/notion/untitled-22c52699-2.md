---
title: ReactでuseEffectが無限ループするバグ
slug: untitled-22c52699-2
tags:
  - react
  - bug
created: 2025-08-07
---


## Context


`useEffect` 内で状態更新を行っていたところ、無限ループが発生。


## Intent


必要なタイミングでのみ状態更新が行われるようにしたい。


## Knowledge

- `useEffect` の依存配列に指定した値が変化すると再実行される。
- `setState` により依存値が毎回変わると無限再実行になる。

## Decision / Result

- `useEffect` の依存配列を適切に見直し、state更新ロジックを条件分岐で制御。
- `useRef` を使って初回のみ処理するように変更。

