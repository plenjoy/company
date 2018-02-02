switch (process.env.NODE_ENV) {
  case 'dev':
    module.exports = require('./dev')
    break

  case 'prod':
    module.exports = require('./prod')
    break

  default:
    module.exports = require('./dev')
    break
}
