/*eslint-disable */
import { MCLogger } from '@map-colonies/mc-logger';
const service = require('../../package.json');
const LOGGER = (window as any)._env_.LOGGER;

const logger : MCLogger = new MCLogger(LOGGER, service);

export default logger;