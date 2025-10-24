import express from 'express';
import { REDIS_CONTROLLER } from './controller/redis.controller';
import { KAFKA_ROUTER } from './controller/kafka.controller';


export const approuter = express();

approuter.use('/redis', REDIS_CONTROLLER)
approuter.use('/kafka', KAFKA_ROUTER)
