const exterminatus = require('./exterminatus').default;
process.env.PATH = '/usr/local/bin/';

function getValues() {
  return {
    ip: document.getElementById('ip').value,
    port: document.getElementById('port').value,
    source: document.getElementById('source').value,
  }
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
    const { ip, port, source } = getValues();
    exterminatus.attack(ip, port, source, 10);
  });

  stop.addEventListener('click', () => {
    exterminatus.killContainers(10);
  });
});