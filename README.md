# 2215001234 Notification Project

This repository contains:

- `logging_middleware/` - reusable Node.js logger package with Express middleware
- `notification_app_be/` - Express backend for notifications
- `notification_system_design.md` - system design documentation

## Run the Backend

```bash
cd 2215001234/notification_app_be
npm install
npm start
```

The server will run at `http://localhost:4000`.

## API Endpoints

- `POST /notifications`
  - Request body example:
    ```json
    {
      "type": "EMAIL",
      "recipient": "abc@gmail.com",
      "message": "Hello"
    }
    ```
- `GET /notifications`
- `GET /notifications/:id`

## Logging Middleware

The backend uses the reusable logger package from `logging_middleware/src`.

## Notes

- `notification_app_be` uses in-memory storage for notifications.
- `logging_middleware` exports `Log`, `requestLogger`, `responseLogger`, and `errorLogger`.
