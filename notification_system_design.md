# Notification System Design

## Architecture

- Client interacts with the API Server using REST requests.
- API Server validates requests and forwards notification creation to the Notification Service.
- Notification Service persists the notification record and places a delivery message onto a Queue.
- Worker nodes consume the Queue and execute channel-specific delivery logic.
- Delivery results are recorded to a Database and notification logs are updated.
- External providers are used for Email and SMS channels, while In-App notifications are stored in the application database.

## Components

### Client

- Sends HTTP requests to the API Server.
- Typical flows: create notification, list notifications, fetch by id.

### API Server

- Hosts REST endpoints for notification operations.
- Uses middleware for request logging, response logging, and error handling.
- Validates payloads and delegates business logic to controller/service layers.

### Notification Service

- Contains business logic for creating, retrieving, and routing notifications.
- Determines channel by `type`:
  - `EMAIL` → Email Service
  - `SMS` → SMS Service
  - `IN_APP` → In-App Service
- Persists notifications to the database.

### Queue

- Decouples API request handling from delivery processing.
- Holds notification jobs for asynchronous processing.
- Examples: RabbitMQ, Kafka, AWS SQS.

### Workers

- Consume queue messages and run delivery workflows.
- Retry failed deliveries and move permanently failed jobs to a Dead Letter Queue.
- Scale horizontally by adding worker instances.

### Email / SMS Providers

- External third-party services for sending messages.
- Integrate through provider APIs with retry and error handling.

### Database

- Stores core entities and logs.
- Suggested tables:
  - `users`
  - `notifications`
  - `notification_logs`

## Database Tables

### users

- `id`
- `name`
- `email`
- `phone`

### notifications

- `id`
- `type`
- `recipient`
- `message`
- `status`
- `created_at`
- `updated_at`

### notification_logs

- `id`
- `notification_id`
- `event`
- `detail`
- `created_at`

## Scalability

- Use a Message Queue to buffer bursts of notification creation.
- Add Worker Nodes to process queue jobs in parallel.
- Place an API Load Balancer in front of API Server instances.
- Horizontally scale both API servers and worker nodes.

## Retry Mechanism

- On failure, retry delivery at least twice.
- Example sequence:
  - Retry 1 after short delay
  - Retry 2 after longer delay
  - If still failing, send the message to a Dead Letter Queue

## Failed Notification Handling

- Store failures with context in `notification_logs`.
- Notify operators or alert systems for repeated failures.
- Use a Dead Letter Queue for manual investigation and reprocessing.

## Stage 4

### Problem

- Notifications are being fetched on every page load for every student.
- The database becomes overwhelmed and response times suffer.
- This leads to a bad user experience for students and administrators.

### Solution

- Apply pagination and limit the number of notifications returned per page.
- Cache recent notifications in memory or Redis for fast inbox reads.
- Use server-side filtering so only relevant notifications are fetched.
- Use read replicas or a separate analytics store for heavy read traffic.

### Tradeoffs

- Pagination improves performance but adds cursor state and UI complexity.
- Caching reduces database load but requires invalidation on updates.
- Read replicas help scale reads, but add replication lag and extra infrastructure.

## Stage 5

### Observed shortcomings

- The sample `notify_all` is synchronous and sends notifications one by one.
- If `send_email` fails for 200 students, the whole process becomes unreliable.
- Saving to DB and sending email together makes the pipeline brittle.
- The implementation is slow and does not scale to 50,000 students.

### Redesign

- Separate persistence from delivery.
- Save the notification records first.
- Publish delivery jobs to a queue for asynchronous processing.
- Use worker processes to send email and in-app notifications concurrently.
- Retry failures independently and route permanent failures to a Dead Letter Queue.

### Revised pseudocode

```
function notify_all(student_ids, message):
  for student_id in student_ids:
    notification_id = save_to_db(student_id, message)
    enqueue_delivery_job(notification_id, 'EMAIL', student_id, message)
    enqueue_delivery_job(notification_id, 'IN_APP', student_id, message)

worker process deliver_notification(job):
  if job.type == 'EMAIL':
    send_email(job.student_id, job.message)
  else if job.type == 'IN_APP':
    push_to_app(job.student_id, job.message)

  if success:
    mark_delivery_status(job.notification_id, 'SENT')
  else:
    retry_or_dead_letter(job)
```

### Why not save and send together?

- Coupling DB save and external send makes the system slower.
- A failure in the email provider should not block the whole notification creation.
- Asynchronous delivery improves reliability and responsiveness.
- Persistence can be confirmed immediately while delivery happens in the background.
