import express from 'express';
import { APP_CONTROLLER } from './controller/app.controller';
import { KAFKA_ROUTER } from './controller/kafka.controller';


export const approuter = express();

approuter.use('/route', APP_CONTROLLER)
approuter.use('/kafka', KAFKA_ROUTER)
