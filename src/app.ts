import express from 'express';
import { client } from './redis/redis';
import { approuter } from './routing';
import { connectKafka } from './kafka/kafka';

const app = express();

function startServer() {
    const PORT = 3000;

    app.listen(PORT, () => {
        console.log(`Server at: `, PORT);
    })

    client.connect().then(() => {
        console.log(`Redis connected`);
    })

    connectKafka().then(() => {
        console.log('Kafka connected successfully');
    });
}

startServer();

app.use('/server', approuter)