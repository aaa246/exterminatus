const exterminatus = require('./exterminatus').default;
if (process.platform === 'darwin') {
  process.env.PATH = '/usr/local/bin/';
}

function getValues() {
  return  document.getElementById('config').value;
}

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }

  const start = document.getElementById('start-action');
  const stop = document.getElementById('stop-action');

  start.addEventListener('click', () => {
    const config = JSON.parse(getValues());
    exterminatus.attack(config);
  });

  stop.addEventListener('click', () => {
    const config = JSON.parse(getValues());
    const { containers } = config;
    exterminatus.killContainers(containers);
  });
});