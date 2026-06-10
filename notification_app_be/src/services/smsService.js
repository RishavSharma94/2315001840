async function sendSms(notification) {
  console.log(`Sending SMS to ${notification.recipient}: ${notification.message}`);
  return Promise.resolve(true);
}

module.exports = {
  sendSms
};
