# Deploy Clara's Best as a Render Web Service with Aiven MySQL

## 1. Create an Aiven MySQL service

1. Sign in to Aiven.
2. Create a MySQL service.
3. Open the service overview page.
4. Copy these values:
   - Host
   - Port
   - User
   - Password
   - Database name, usually `defaultdb`
   - CA certificate

## 2. Push this project to GitHub

```bash
git add .
git commit -m "Add Node web service and Aiven MySQL persistence"
git push
```

## 3. Create a Render Web Service

1. Open Render.
2. Click **New +**.
3. Choose **Web Service**.
4. Connect your GitHub repository.
5. Use these settings:

```txt
Runtime: Node
Build Command: npm install && npm run build
Start Command: node server.js
```

## 4. Add Render environment variables

Use either `DATABASE_URL` or the separate Aiven variables.

Recommended:

```txt
DATABASE_URL=mysql://avnadmin:YOUR_PASSWORD@YOUR_AIVEN_HOST:YOUR_AIVEN_PORT/defaultdb
AIVEN_CA_CERT=-----BEGIN CERTIFICATE-----\nPASTE_AIVEN_CA_CERT_HERE\n-----END CERTIFICATE-----
DB_SSL_REJECT_UNAUTHORIZED=true
```

If Render gives issues with multiline certificates, base64 encode the CA certificate and use:

```txt
AIVEN_CA_CERT_BASE64=YOUR_BASE64_CERT
```

## 5. Deploy

Render will build the React app into `dist` and start `server.js`.
The same Web Service serves:

```txt
Frontend: /
API health: /api/health
System data: /api/bootstrap
Save data: /api/snapshot
```

## 6. Verify

Open:

```txt
https://your-service.onrender.com/api/health
```

You should see:

```json
{ "ok": true, "database": "mysql" }
```

If it says `memory-fallback`, the app is running but your MySQL environment variables are missing or incorrect.