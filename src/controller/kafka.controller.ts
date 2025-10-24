import express from 'express';
import { producer, connectKafka } from '../kafka/kafka';

export const KAFKA_ROUTER = express();
KAFKA_ROUTER.use(express.json());

KAFKA_ROUTER.post('/publish', async (req, res) => {
    const { message } = req.body;

    try {
        await producer.send({
            topic: 'test-topic',
            messages: [{ value: message }]
        })

        res.status(200).send({ success: true, message: 'Message sent to Kafka' });
    } catch (error: any) {
        console.error(error);
        res.status(500).send({ success: false, error: error.message });
    }
})