# Web Interfaces - Quick Reference

## 🌐 All Access Points

| Service | URL | Credentials | Purpose |
|---------|-----|-------------|---------|
| **Notification Service** | http://localhost:8086 | - | Main service |
| **Swagger UI** | http://localhost:8086/swagger-ui.html | - | REST API testing |
| **Kafka UI** | http://localhost:8090 | - | Send Kafka events |
| **pgAdmin** | http://localhost:5050 | Email: `admin@bidconnect.com`<br>Password: `admin` | PostgreSQL management |
| **MailHog** | http://localhost:8025 | - | View sent emails |

---

## 🚀 Quick Start

### **1. Start All Services**
```bash
cd d:\ayoub\study\S3\Projects\BidConnect\NOTIFICATION-SERVICE
docker-compose up -d
```

### **2. Send a Test Notification**

**Option A: Using Kafka UI (Easiest)**
1. Open http://localhost:8090
2. Topics → notification-events → Produce Message
3. Paste JSON event (see [KAFKA-UI-GUIDE.md](file:///d:/ayoub/study/S3/Projects/BidConnect/NOTIFICATION-SERVICE/KAFKA-UI-GUIDE.md))

**Option B: Using Swagger UI**
1. Open http://localhost:8086/swagger-ui.html
2. POST /api/notifications/send → Try it out
3. Enter notification details

### **3. Verify Results**

✅ **Email sent**: http://localhost:8025 (MailHog)  
✅ **Database record**: http://localhost:5050 (pgAdmin)  
✅ **API query**: http://localhost:8086/swagger-ui.html (GET /api/notifications)

---

## 📚 Detailed Guides

- [KAFKA-UI-GUIDE.md](file:///d:/ayoub/study/S3/Projects/BidConnect/NOTIFICATION-SERVICE/KAFKA-UI-GUIDE.md) - How to send Kafka events
- [PGADMIN-GUIDE.md](file:///d:/ayoub/study/S3/Projects/BidConnect/NOTIFICATION-SERVICE/PGADMIN-GUIDE.md) - How to query the database
- [SWAGGER.md](file:///d:/ayoub/study/S3/Projects/BidConnect/NOTIFICATION-SERVICE/SWAGGER.md) - REST API documentation
- [README.md](file:///d:/ayoub/study/S3/Projects/BidConnect/NOTIFICATION-SERVICE/README.md) - Complete service documentation

---

## 🔧 Port Assignments (No Conflicts)

- **8086** - Notification Service
- **8090** - Kafka UI (changed from 8080)
- **5050** - pgAdmin
- **8025** - MailHog Web UI
- **9092** - Kafka
- **5432** - PostgreSQL
- **2181** - Zookeeper
- **1025** - SMTP (MailHog)

All ports are carefully selected to avoid conflicts with your other BidConnect services! ✅
