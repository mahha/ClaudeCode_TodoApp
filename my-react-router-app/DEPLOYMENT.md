# Cloudflare Workers デプロイメントガイド

このガイドでは、React Router ToDo アプリを Cloudflare Workers にデプロイする方法を説明します。

## 前提条件

デプロイを開始する前に、以下を確認してください：

1. **Cloudflare アカウント**: https://dash.cloudflare.com/sign-up でサインアップ
2. **Node.js と npm**: インストール済み（`node --version` で確認）
3. **プロジェクトのビルド**: `npm run build` を実行してビルドが成功することを確認

## デプロイ手順

### ステップ1: ビルドと型チェックの確認

デプロイ前に、プロジェクトが正常にビルドできることを確認します：

```bash
# プロジェクトをビルド
npm run build

# 型チェックを実行
npm run typecheck
```

両方のコマンドがエラーなく完了することを確認してください。

### ステップ2: Cloudflare での認証

認証方法は2つあります：

#### オプションA: インタラクティブログイン（推奨）

```bash
npx wrangler login
```

このコマンドは以下を行います：
- ブラウザを自動的に開く
- Cloudflare へのログインを促す
- ブラウザに "Successfully logged in" メッセージを表示
- Wrangler があなたのアカウントにアクセスする許可をリクエスト
- 認証情報を `~/.config/.wrangler/config/default.toml` にローカル保存

**この方法では API トークンの設定は不要です。**

**認証の確認**:
```bash
npx wrangler whoami
```

このコマンドで、アカウント情報とトークンのアクセス権限が表示されます。

**devcontainer ユーザーへの注意**: devcontainer 環境でも認証はシームレスに動作します。`~/.config/.wrangler/` ディレクトリはコンテナ内で永続化されるため、認証は一度だけ行えば済みます。

#### オプションB: API トークン（上級者向け）

API トークンを使用する場合：

1. https://dash.cloudflare.com/profile/api-tokens にアクセス
2. "Edit Cloudflare Workers" 権限を持つ新しいトークンを作成
3. 環境変数を設定：

```bash
export CLOUDFLARE_API_TOKEN="your-api-token-here"
```

**重要**: API トークンを Git にコミットしないでください。

### ステップ3: Cloudflare Workers へのデプロイ

認証が完了したら、アプリケーションをデプロイします：

```bash
npm run deploy
```

このコマンドは以下を実行します：
1. アプリケーションをビルド（`npm run build`）
2. Cloudflare Workers にデプロイ（`wrangler deploy`）
3. アプリがホストされている Workers URL を出力

期待される出力例：
```
Total Upload: XX.XX KiB / gzip: XX.XX KiB
Uploaded my-react-router-app (X.XX sec)
Deployed my-react-router-app triggers (X.XX sec)
  https://my-react-router-app.<your-subdomain>.workers.dev
Current Version ID: <version-id>
```

### ステップ4: デプロイの確認

1. デプロイ出力に表示された Workers URL を開く
2. ToDo アプリが正しく読み込まれることを確認
3. モックの ToDo データが表示されることを確認
4. スタイリングが正しく適用されていることを確認
5. ブラウザの DevTools を開き、コンソールエラーがないことを確認（エラーは出ないはずです）

## デプロイ設定

### 現在の設定

アプリは `wrangler.jsonc` で設定されています：

```jsonc
{
  "name": "my-react-router-app",
  "compatibility_date": "2025-04-04",
  "main": "./workers/app.ts",
  "vars": {
    "VALUE_FROM_CLOUDFLARE": "Hello from Cloudflare"
  },
  "observability": {
    "enabled": true
  }
}
```

### デプロイされる内容

- **Worker エントリポイント**: `workers/app.ts` - React Router リクエストハンドラー
- **クライアントアセット**: ビルドされた React アプリケーション（HTML、CSS、JS）
- **SSR**: 高速な初期ページ読み込みのためにサーバーサイドレンダリングが有効

### 現在のスコープに含まれないもの

- D1 データベース接続（コメントアウト済み - 将来の issue で追加予定）
- 環境別設定（dev/staging/prod）
- CI/CD パイプライン

## パフォーマンス目標

このデプロイメントの目標指標：

- **コールドスタート**: 約0ms（Cloudflare Workers の利点）
- **応答時間**: 動的リクエストで200ms未満
- **グローバル配信**: 300以上のエッジロケーションで利用可能

## トラブルシューティング

### 認証に関する問題

**問題**: `wrangler login` でブラウザが開かない

**解決策**: API トークン方式（上記オプションB）を使用

---

**問題**: "Not authenticated" エラー

**解決策**:
```bash
npx wrangler whoami  # 認証状態を確認
npx wrangler login   # 再認証
```

---

**問題**: 認証情報が保存されているか確認したい

**解決策**:
認証情報は `~/.config/.wrangler/config/default.toml` に保存されています。確認方法：
```bash
# 設定ファイルが存在するか確認
ls -la ~/.config/.wrangler/config/default.toml

# 認証状態を確認
npx wrangler whoami
```

設定ファイルには自動更新機能付きの OAuth トークンが含まれています。`wrangler whoami` を実行すると、メールアドレスとアカウント情報が表示されるはずです。

### ビルドエラー

**問題**: 型エラーでビルドが失敗する

**解決策**:
```bash
npm run typecheck   # 型エラーを特定
npm run cf-typegen  # Cloudflare の型を再生成
```

### デプロイエラー

**問題**: "Worker name already exists" エラー

**解決策**: `wrangler.jsonc` の `name` フィールドをユニークな値に変更

---

**問題**: アセットが読み込まれない（404エラー）

**解決策**: デプロイ前に `npm run build` が正常に完了していることを確認

## リソース制限（無料プラン）

Cloudflare Workers 無料プランには以下が含まれます：

- **リクエスト**: 100,000リクエスト/日
- **CPU時間**: リクエストあたり10ms
- **メモリ**: リクエストあたり128MB
- **スクリプトサイズ**: 圧縮後1MB

これは開発や小規模な本番運用には十分です。

## 次のステップ

デプロイが成功したら、以下を検討してください：

1. **カスタムドメイン**: Cloudflare ダッシュボードでカスタムドメインを追加
2. **D1 データベース**: 永続的な ToDo ストレージのためにデータベースを統合（別 issue）
3. **CI/CD**: GitHub Actions で自動デプロイを設定（別 issue）
4. **モニタリング**: Cloudflare Analytics で使用状況とパフォーマンスを監視

## 便利なコマンド

```bash
# Wrangler のバージョン確認
npx wrangler --version

# デプロイ一覧を表示
npx wrangler deployments list

# Worker のログを表示（tail）
npx wrangler tail

# デプロイを削除
npx wrangler delete my-react-router-app

# 認証状態を確認
npx wrangler whoami
```

## サポート

- [Cloudflare Workers ドキュメント](https://developers.cloudflare.com/workers)
- [React Router v7 Cloudflare ガイド](https://reactrouter.com/start/deploying/cloudflare)
- [Wrangler CLI リファレンス](https://developers.cloudflare.com/workers/wrangler/commands)

## セキュリティに関する注意

1. **絶対にコミットしないもの**:
   - プロジェクトルートの `.wrangler/` ディレクトリ（.gitignoreに既に追加済み）
   - `~/.config/.wrangler/` ディレクトリ（認証情報を含む）
   - API トークンやシークレット
   - `.dev.vars` ファイル（作成した場合）

2. **機密データには Wrangler Secrets を使用**:
   ```bash
   npx wrangler secret put SECRET_NAME
   ```

3. **本番デプロイには Cloudflare WAF を有効化**: ダッシュボードで設定
