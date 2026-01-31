# Using pgAdmin to Manage PostgreSQL Database

## 🎯 Quick Start

After running `docker-compose up -d`, open pgAdmin in your browser:

**http://localhost:5050**

**Login Credentials:**
- Email: `admin@bidconnect.com`
- Password: `admin`

---

## 🔧 First Time Setup: Connect to PostgreSQL

### **Step 1: Add New Server**

1. Open http://localhost:5050
2. Login with the credentials above
3. Right-click **Servers** in the left panel
4. Select **Register** → **Server**

### **Step 2: Configure Connection**

**General Tab:**
- Name: `Notification Database`

**Connection Tab:**
- Host name/address: `postgres` (the container name)
- Port: `5432`
- Maintenance database: `notification_db`
- Username: `notification_user`
- Password: `notification_pass`
- ✅ Check "Save password"

Click **Save**

---

## 📊 View Notification Data

### **Navigate to the Notifications Table**

1. Expand **Servers** → **Notification Database**
2. Expand **Databases** → **notification_db**
3. Expand **Schemas** → **public**
4. Expand **Tables**
5. Right-click **notifications** → **View/Edit Data** → **All Rows**

### **Run Custom Queries**

1. Click **Tools** → **Query Tool**
2. Run queries like:

```sql
-- View all notifications
SELECT * FROM notifications ORDER BY created_at DESC;

-- Count by status
SELECT status, COUNT(*) as count 
FROM notifications 
GROUP BY status;

-- View failed notifications
SELECT id, email, event_type, subject, created_at 
FROM notifications 
WHERE status = 'FAILED';

-- Notifications by event type
SELECT event_type, COUNT(*) as count 
FROM notifications 
GROUP BY event_type;

-- Recent notifications for a specific user
SELECT * FROM notifications 
WHERE user_id = 1 
ORDER BY created_at DESC 
LIMIT 10;
```

---

## 🔍 Useful Features

### **Export Data**
- Right-click table → **Import/Export**
- Export to CSV, Excel, or other formats

### **View Table Structure**
- Right-click **notifications** table → **Properties**
- See columns, indexes, constraints

### **Monitor Queries**
- **Dashboard** tab shows active connections and queries

### **Backup Database**
- Right-click **notification_db** → **Backup**
- Save database snapshot

---

## 📈 Quick Stats Queries

### **Success Rate**
```sql
SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN status = 'SENT' THEN 1 ELSE 0 END) as sent,
    SUM(CASE WHEN status = 'FAILED' THEN 1 ELSE 0 END) as failed,
    ROUND(100.0 * SUM(CASE WHEN status = 'SENT' THEN 1 ELSE 0 END) / COUNT(*), 2) as success_rate
FROM notifications;
```

### **Notifications Per Day**
```sql
SELECT 
    DATE(created_at) as date,
    COUNT(*) as count
FROM notifications
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### **Top Recipients**
```sql
SELECT 
    email,
    COUNT(*) as notification_count
FROM notifications
GROUP BY email
ORDER BY notification_count DESC
LIMIT 10;
```

---

## 🚀 Access Points Summary

| Service | URL | Purpose |
|---------|-----|---------|
| **pgAdmin** | http://localhost:5050 | PostgreSQL management |
| **Kafka UI** | http://localhost:8090 | Send Kafka events |
| **MailHog** | http://localhost:8025 | View sent emails |
| **Swagger UI** | http://localhost:8086/swagger-ui.html | REST API testing |

---

## 💡 Tips

- **Refresh data**: Click the refresh button (🔄) to see new notifications
- **Filter results**: Use the filter icon in table view
- **Save queries**: Save frequently used queries for quick access
- **Multiple tabs**: Open multiple query tools for different queries

That's it! Now you have full visual access to your PostgreSQL database! 🎉
