import { Kafka, logLevel, Partitioners } from 'kafkajs';

export const kafka = new Kafka({
    clientId: 'nodejs-app',
    brokers: ['localhost:9092'],
    logLevel: logLevel.WARN
})

export const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner
});
export const consumer = kafka.consumer({
    groupId: 'node-group',
    rebalanceTimeout: 1000
});

export async function connectKafka() {
    await producer.connect();
    await consumer.connect();

    //subscribe consumer to topic
    await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });

    //listen for msgs
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log(`Received message: ${message.value?.toString() ?? 'null'}`);
        }
    })
}