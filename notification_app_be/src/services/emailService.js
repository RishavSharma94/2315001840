async function sendEmail(notification) {
  console.log(`Sending EMAIL to ${notification.recipient}: ${notification.message}`);
  return Promise.resolve(true);
}

module.exports = {
  sendEmail
};
