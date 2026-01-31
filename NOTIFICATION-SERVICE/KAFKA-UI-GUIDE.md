# Using Kafka UI to Send Notification Events

## 🎯 Quick Start

After running `docker-compose up -d`, open Kafka UI in your browser:

**http://localhost:8090**

---

## 📤 How to Send a Notification Event

### **Step 1: Navigate to Topics**

1. Open http://localhost:8080
2. Click on **Topics** in the left sidebar
3. Find and click on **notification-events** topic (it will be auto-created when the service starts)

### **Step 2: Produce a Message**

1. Click the **Produce Message** button (top right)
2. Leave **Key** empty (optional)
3. In the **Content** field, select **JSON** format
4. Paste one of the event examples below
5. Click **Produce Message**

---

## 📧 Event Examples (Copy & Paste)

### **1. Tender Published** (Purple Email Template)

```json
{
  "eventId": "550e8400-e29b-41d4-a716-446655440000",
  "eventType": "TENDER_PUBLISHED",
  "timestamp": "2026-01-31T18:00:00Z",
  "recipients": [
    {
      "userId": 1,
      "email": "supplier@test.com",
      "role": "SUPPLIER"
    }
  ],
  "data": {
    "title": "New Construction Tender Available",
    "message": "A new tender for construction services has been published that matches your profile."
  }
}
```

### **2. Submission Received** (Blue Email Template)

```json
{
  "eventId": "550e8400-e29b-41d4-a716-446655440001",
  "eventType": "SUBMISSION_RECEIVED",
  "timestamp": "2026-01-31T18:00:00Z",
  "recipients": [
    {
      "userId": 2,
      "email": "owner@test.com",
      "role": "OWNER"
    }
  ],
  "data": {
    "title": "New Submission Received",
    "message": "You have received a new submission for your tender."
  }
}
```

### **3. Submission Accepted** (Green Email Template)

```json
{
  "eventId": "550e8400-e29b-41d4-a716-446655440002",
  "eventType": "SUBMISSION_ACCEPTED",
  "timestamp": "2026-01-31T18:00:00Z",
  "recipients": [
    {
      "userId": 1,
      "email": "supplier@test.com",
      "role": "SUPPLIER"
    }
  ],
  "data": {
    "title": "Congratulations! Your Submission Was Accepted",
    "message": "Your proposal has been selected. The tender owner will contact you soon."
  }
}
```

### **4. Submission Rejected** (Pink Email Template)

```json
{
  "eventId": "550e8400-e29b-41d4-a716-446655440003",
  "eventType": "SUBMISSION_REJECTED",
  "timestamp": "2026-01-31T18:00:00Z",
  "recipients": [
    {
      "userId": 1,
      "email": "supplier@test.com",
      "role": "SUPPLIER"
    }
  ],
  "data": {
    "title": "Submission Status Update",
    "message": "Thank you for your submission. Unfortunately, your proposal was not selected this time."
  }
}
```

---

## ✅ Verify the Email Was Sent

After sending the event:

1. **Check MailHog**: Open http://localhost:8025
2. You should see the email with the rendered HTML template
3. **Check Database**: 
   ```bash
   docker-compose exec postgres psql -U notification_user -d notification_db -c "SELECT * FROM notifications ORDER BY created_at DESC LIMIT 5;"
   ```

---

## 🔍 Other Kafka UI Features

### **View Messages**
- Click on a topic → **Messages** tab
- See all events that have been sent

### **View Consumer Groups**
- Click **Consumers** in sidebar
- See `notification-service-group` and its lag/offset

### **Topic Configuration**
- View partitions, replication factor
- See topic settings

### **Monitor Performance**
- Real-time message throughput
- Consumer lag monitoring

---

## 🚀 Quick Test Flow

1. **Start services**: `docker-compose up -d`
2. **Open Kafka UI**: http://localhost:8080
3. **Send event**: Topics → notification-events → Produce Message → Paste JSON
4. **Check email**: http://localhost:8025
5. **View in Swagger**: http://localhost:8086/swagger-ui.html → GET /api/notifications

That's it! Much easier than using the command line! 🎉
