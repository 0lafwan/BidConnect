# 📧 How to Send Real Emails (Gmail, Outlook, AWS SES)

Currently, the service uses **MailHog** for local testing. To send **real emails**, you need to configure an SMTP server.

## 1️⃣ Quick Setup: Using Gmail

> **Note:** You cannot use your regular password. You MUST enable **2-Factor Authentication (2FA)** and generate an **App Password**.

### **Step 1: Generate App Password**
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** (if not enabled)
3. Search for **"App passwords"**
4. Create a new one (Name it: `BidConnect`)
5. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### **Step 2: Update `docker-compose.yml`**

Open `d:\ayoub\study\S3\Projects\BidConnect\NOTIFICATION-SERVICE\docker-compose.yml` and modify the `notification-service` environment variables:

```yaml
    environment:
      # ... other settings ...
      
      # 👇 CHANGE THESE FOR REAL EMAILS
      SPRING_MAIL_HOST: smtp.gmail.com
      SPRING_MAIL_PORT: 587
      SPRING_MAIL_USERNAME: your.email@gmail.com
      SPRING_MAIL_PASSWORD: "your 16 char app password"
      SPRING_MAIL_PROPERTIES_MAIL_SMTP_AUTH: "true"
      SPRING_MAIL_PROPERTIES_MAIL_SMTP_STARTTLS_ENABLE: "true"
```

### **Step 3: Restart Service**
```bash
docker-compose up -d --build notification-service
```

---

## 2️⃣ Generic SMTP Configuration (Outlook, SendGrid, etc.)

Use these settings for any provider:

| Provider | Host | Port | TLS Required? |
|----------|------|------|---------------|
| **Gmail** | `smtp.gmail.com` | `587` | Yes |
| **Outlook / Hotmail** | `smtp-mail.outlook.com` | `587` | Yes |
| **SendGrid** | `smtp.sendgrid.net` | `587` | Yes |
| **Amazon SES** | `email-smtp.[region].amazonaws.com` | `587` | Yes |

### **Configuration in Docker Compose:**

```yaml
    environment:
      SPRING_MAIL_HOST: [YOUR_SMTP_HOST]
      SPRING_MAIL_PORT: 587
      SPRING_MAIL_USERNAME: [YOUR_USERNAME]
      SPRING_MAIL_PASSWORD: [YOUR_PASSWORD_OR_API_KEY]
      SPRING_MAIL_PROPERTIES_MAIL_SMTP_AUTH: "true"
      SPRING_MAIL_PROPERTIES_MAIL_SMTP_STARTTLS_ENABLE: "true"
```

---

## 3️⃣ Troubleshooting

- **Connection Refused?** Check if your firewall blocks port `587`.
- **Authentication Failed?** Double-check your **App Password** (for Gmail) or API Key.
- **TLS Error?** Ensure `SPRING_MAIL_PROPERTIES_MAIL_SMTP_STARTTLS_ENABLE` is set to `"true"`.

---

## ⚠️ Security Warning

**NEVER commit your real passwords to GitHub!** 
Instead, using a `.env` file is recommended for production.

1. Create a `.env` file in the same folder as `docker-compose.yml`:
   ```properties
   MAIL_USER=your.email@gmail.com
   MAIL_PASS=your_app_password
   ```

2. Update `docker-compose.yml`:
   ```yaml
   SPRING_MAIL_USERNAME: ${MAIL_USER}
   SPRING_MAIL_PASSWORD: ${MAIL_PASS}
   ```
