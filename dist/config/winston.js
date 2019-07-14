'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const app_root_path_1 = __importDefault(require('app-root-path'));
const winston_1 = __importDefault(require('winston'));
const options = {
  console: {
    colorize: true,
    handleException: true,
    json: false,
    level: 'debug'
  },
  file: {
    colorize: false,
    filename: `${app_root_path_1.default}/logs/app.log`,
    handleExceptions: true,
    json: true,
    level: 'info',
    maxFiles: 5,
    maxsize: 5242880
  }
};
const logger = new winston_1.default.loggers({
  exitOnError: false,
  transports: [
    new winston_1.default.transports.File(options.file),
    new winston_1.default.transports.Console(options.console)
  ]
});
logger.stream = {
  write(message, encoding) {
    logger.info(message);
  }
};
exports.default = logger;
//# sourceMappingURL=winston.js.map
