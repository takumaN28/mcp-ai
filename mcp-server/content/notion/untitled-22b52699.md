---
title: Notion APIでナレッジ同期
slug: untitled-22b52699
tags:
  - notion
  - api
created: 2025-08-07
---


## Context


Notionに書いたナレッジをMarkdownに自動変換し、MCPサーバーに取り込む。


## Intent


Notionで記録した知見をそのままコードベースで検索・再利用可能にしたい。


## Knowledge

- `@notionhq/client` を使ってデータベースから取得
- `.env` にAPIキーとデータベースIDを保存

## Decision / Result


同期スクリプトを `scripts/sync-notion-to-md.ts` にて作成・運用中。


