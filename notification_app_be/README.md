# Notification Backend

An Express.js backend for creating and retrieving notifications.

## Install

```bash
cd notification_app_be
npm install
```

## Run

```bash
npm start
```

## API

- `POST /notifications`
  - Body: `{ "type": "EMAIL", "recipient": "abc@gmail.com", "message": "Hello" }`
- `GET /notifications`
- `GET /notifications/:id`

## Notification Types

- `EMAIL`
- `SMS`
- `IN_APP`

The backend uses logging middleware from the local `logging_middleware` package.
