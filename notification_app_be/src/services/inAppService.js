async function sendInApp(notification) {
  console.log(`Recording IN_APP notification for ${notification.recipient}: ${notification.message}`);
  return Promise.resolve(true);
}

module.exports = {
  sendInApp
};
