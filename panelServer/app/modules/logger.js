'use strict';

const log4js = require('log4js');
const config = require('../config');
const cryptoCustom = require('../utils/crypto');
const loggerConfig = config.logging ? config.logging : {};

// Fallback
if (!loggerConfig.logLevel) {
    loggerConfig.logLevel = "ERROR";
}
// https://log4js-node.github.io/log4js-node/layouts.html
log4js.configure({
    appenders: {
        stdout: {
            type: 'stdout',
            layout: {
                type: 'pattern',
                pattern: '%[[%x{uuid}] [%d] [%p] <%c> {%f{2}:%l}%] => %m',
                tokens: {
                    uuid: function (logEvent) {
                        return cryptoCustom.getUUID();
                    }
                }
            },
        }
    },
    categories: {
        default: {
            appenders: ['stdout'],
            level: loggerConfig.logLevel,
            enableCallStack: true
        }
    }
});

module.exports = (moduleName) => {
    const logger = log4js.getLogger(moduleName);
    return logger;
};