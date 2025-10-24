import redis, { createClient } from 'redis'

const R_PORT: any = 6379

const client = createClient({ url: `redis://172.20.11.234:${R_PORT}` })

client.on('error', (err) => console.log(`Redis error`, err));

export { client }