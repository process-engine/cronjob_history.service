const {CronjobHistoryService} = require('./dist/commonjs/index');

function registerInContainer(container) {
  container
    .register('CronjobHistoryService', CronjobHistoryService)
    .dependencies('CronjobHistoryRepository', 'IamService');
}

module.exports.registerInContainer = registerInContainer;
