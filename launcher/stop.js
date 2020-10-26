const sh = require('shelljs')

module.exports = () => {
  sh.cd('~/.hyper63')
  sh.exec('docker-compose down')
}
