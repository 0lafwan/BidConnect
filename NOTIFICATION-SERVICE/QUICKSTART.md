# Quick Start Guide - Notification-Service

## 🎯 What You Have

A complete, production-ready Notification-Service microservice with:
- ✅ Kafka event consumption
- ✅ Professional HTML email templates
- ✅ PostgreSQL persistence
- ✅ Full Docker Compose stack

## 🚀 To Run the Service

### Step 1: Build the Docker Image

Open terminal in `NOTIFICATION-SERVICE` directory and run:

```bash
# If Maven is installed
mvn clean compile jib:dockerBuild

# OR use your IDE (IntelliJ/Eclipse)
# Run Maven goal: clean compile jib:dockerBuild
```

### Step 2: Start Everything

```bash
docker-compose up -d
```

### Step 3: Test It

**Send a test event:**
```bash
docker-compose exec kafka kafka-console-producer --broker-list localhost:9092 --topic notification-events
```

**Paste this JSON:**
```json
{"eventId":"123e4567-e89b-12d3-a456-426614174000","eventType":"TENDER_PUBLISHED","timestamp":"2026-01-31T13:30:00Z","recipients":[{"userId":1,"email":"test@example.com","role":"SUPPLIER"}],"data":{"title":"New Tender","message":"A new tender has been published"}}
```

**View the email:**
Open http://localhost:8025 in your browser

## 📚 Full Documentation

- [README.md](file:///d:/ayoub/study/S3/Projects/BidConnect/NOTIFICATION-SERVICE/README.md) - Complete service documentation
- [walkthrough.md](file:///C:/Users/BARAKAT%20YOUSSEF/.gemini/antigravity/brain/db8ee40d-0123-4639-bdaf-45d189cd5f97/walkthrough.md) - Detailed implementation walkthrough

## 🔧 Troubleshooting

If Maven is not installed, use your IDE to run the Jib build goal, or install Maven first.

## ✅ What's Included

| Component | Status |
|-----------|--------|
| Java 21 + Spring Boot 3.2.2 | ✅ |
| Kafka Consumer | ✅ |
| Email Templates (4 types) | ✅ |
| PostgreSQL Integration | ✅ |
| Docker Compose Stack | ✅ |
| Documentation | ✅ |
