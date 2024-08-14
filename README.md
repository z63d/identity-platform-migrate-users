# identity-platform-migrate-users

Google Cloud Identity Platform のユーザー情報を別 project の Identity Platform に移行するツール

前提条件や注意事項は以下のドキュメントを参照
- https://cloud.google.com/identity-platform/docs/migrate-users-between-projects-tenants?hl=ja
- https://cloud.google.com/identity-platform/docs/migrating-users?hl=ja

## 準備

```
npm install
```

## ユーザー移行

- 移行元の [Identity Platform](https://console.cloud.google.com/customer-identity/users) の [ユーザーをインポート] からパスワードハッシュパラメータを確認する。これを元に `.env` を設定する

- [サービス アカウント キーの構成](https://cloud.google.com/identity-platform/docs/migrate-users-between-projects-tenants?hl=ja#configuring_service_account_keys)

  > 移行元と移行先のプロジェクトの両方のサービス アカウント キーが必要です。ソース プロジェクトのユーザーとハッシュされたパスワードにアクセスするには、サービス アカウントに少なくとも IAM 編集者のロール（roles/editor）が付与されている必要があります。

  サービス アカウント キー を発行して `source-project-service-account.json`, `target-project-service-account.json` に記載する

- 移行

  ```
  node migrate.js
  ```

## サインイン確認

- [Identity Platform](https://console.cloud.google.com/customer-identity/users) の [アプリケーション設定の詳細] とユーザーのデータを元に `.env` を設定する

- 移行後にユーザーが同じパスワードでサインイン可能なことを確認できる

  ```
  node signIn.js
  ```
