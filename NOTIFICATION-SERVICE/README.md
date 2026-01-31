# Notification Service

Event-driven notification microservice for BidConnect platform.

## Features

- 📨 Kafka-based event consumption
- 📧 HTML email sending with Thymeleaf templates
- 💾 PostgreSQL notification history
- 🐳 Fully Dockerized with Docker Compose
- 📬 MailHog for local email testing

## Tech Stack

- Java 21
- Spring Boot 3.2.2
- Apache Kafka
- PostgreSQL
- Thymeleaf
- MailHog

## Quick Start

### Build and Run with Docker Compose

```bash
# Build the Docker image
mvn clean compile jib:dockerBuild

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f notification-service

# Stop all services
docker-compose down -v
```

### Access Points

- **Notification Service**: http://localhost:8086
- **Swagger UI**: http://localhost:8086/swagger-ui.html
- **OpenAPI Docs**: http://localhost:8086/api-docs
- **Kafka UI**: http://localhost:8090 (Manage Kafka topics, send messages)
- **pgAdmin**: http://localhost:5050 (PostgreSQL database management)
  - Email: `admin@bidconnect.com`
  - Password: `admin`
- **MailHog Web UI**: http://localhost:8025
- **Kafka**: localhost:9092
- **PostgreSQL**: localhost:5432

## Event Format

Send events to the `notification-events` Kafka topic:

```json
{
  "eventId": "123e4567-e89b-12d3-a456-426614174000",
  "eventType": "TENDER_PUBLISHED",
  "timestamp": "2026-01-31T13:30:00Z",
  "recipients": [
    {
      "userId": 1,
      "email": "user@example.com",
      "role": "SUPPLIER"
    }
  ],
  "data": {
    "title": "Event Title",
    "message": "Event message content"
  }
}
```

### Supported Event Types

- `TENDER_PUBLISHED`
- `SUBMISSION_RECEIVED`
- `SUBMISSION_ACCEPTED`
- `SUBMISSION_REJECTED`

## REST API Endpoints

The service provides REST endpoints for querying notification history and manual testing:

### Query Endpoints

- `GET /api/notifications` - Get all notifications
- `GET /api/notifications/{id}` - Get notification by ID
- `GET /api/notifications/user/{userId}` - Get notifications for a user
- `GET /api/notifications/status/{status}` - Get notifications by status (PENDING, SENT, FAILED)
- `GET /api/notifications/event-type/{eventType}` - Get notifications by event type
- `GET /api/notifications/stats` - Get notification statistics

### Manual Notification

- `POST /api/notifications/send` - Manually send a notification

**Example Request:**
```json
{
  "userId": 123,
  "email": "user@example.com",
  "eventType": "TENDER_PUBLISHED",
  "title": "Test Notification",
  "message": "This is a test message"
}
```

### Swagger UI

Access the interactive API documentation at: **http://localhost:8086/swagger-ui.html**

## Testing

### Send Test Event via Kafka Console Producer

```bash
docker-compose exec kafka kafka-console-producer --broker-list localhost:9092 --topic notification-events
```

Then paste a test event JSON and press Enter.

### View Sent Emails

Open http://localhost:8025 in your browser to see all emails sent via MailHog.

### Check Database

```bash
docker-compose exec postgres psql -U notification_user -d notification_db -c "SELECT * FROM notifications;"
```

## Database Schema

```sql
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    email VARCHAR(255) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    sent_at TIMESTAMP
);
```

## Configuration

Key configuration in `application.properties`:

- Kafka bootstrap servers
- PostgreSQL connection
- SMTP settings (MailHog)
- Thymeleaf template location

## Architecture

```
Kafka Topic (notification-events)
    ↓
NotificationEventConsumer
    ↓
NotificationService
    ├─→ EmailService (Thymeleaf + SMTP)
    └─→ NotificationRepository (PostgreSQL)
```

## License

Part of the BidConnect platform.
