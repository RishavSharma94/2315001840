const express = require('express');
const dotenv = require('dotenv');
const notificationRoutes = require('./routes/notificationRoutes');
const { requestLogger, responseLogger, errorLogger } = require('./middleware/loggerMiddleware');

dotenv.config();

const app = express();
app.use(express.json());

app.use(requestLogger);
app.use(responseLogger);

app.use('/notifications', notificationRoutes);

app.use(errorLogger);

app.get('/', (req, res) => {
  res.json({ message: 'Notification API is running' });
});

module.exports = app;
