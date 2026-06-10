const levels = ['debug', 'info', 'warn', 'error'];

function formatLog({ stack, level, packageName, message, meta }) {
  const time = new Date().toISOString();
  return JSON.stringify({ time, stack, level, packageName, message, meta });
}

async function Log(stack, level = 'info', packageName = 'app', message = '', meta = {}) {
  if (!levels.includes(level)) {
    level = 'info';
  }

  const output = formatLog({ stack, level, packageName, message, meta });

  if (level === 'error') {
    console.error(output);
  } else if (level === 'warn') {
    console.warn(output);
  } else {
    console.log(output);
  }

  return Promise.resolve({ stack, level, packageName, message, meta, time: new Date().toISOString() });
}

module.exports = { Log, levels };
