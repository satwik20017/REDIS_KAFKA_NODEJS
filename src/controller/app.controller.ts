import express from 'express';
import axios from 'axios';
import { client } from '../redis/redis';

export const APP_CONTROLLER = express();


APP_CONTROLLER.get('/getMessage', (req, res) => {
    return res.send(`Done routing`);
})


// CACHE middleware
export async function cache(req, res, next) {
    try {
        const key = 'USERS_DATA_BY_CACHE';
        const cachedRawData: any = await client.get(key);
        const cachedData = JSON.parse(cachedRawData);

        if (cachedData) {

            await client.incr('Hit_Count');

            const count = await client.get('Hit_Count')

            let names = cachedData.map((x) => x.name);
            return res.status(200).json({
                message: 'Data from Redis cache',
                hits: `${req.originalUrl} got ${count} hits.`,
                data: cachedData
            });
        }
        next();
    } catch (error) {
        console.error('Redis cache error:', error);
        next();
    }
}



APP_CONTROLLER.get('/repos', cache, async (req, res) => {
    try {
        console.log(`fetching data....`);

        const redis_expiry_time = 90;

        const response = await axios.get(`https://jsonplaceholder.typicode.com/users`);

        const users = response.data;

        //send to redis
        // await client.setEx(username, redis_expiry_time, JSON.stringify(data))
        await client.set('USERS_DATA_REPOS', JSON.stringify(users));
        await client.set('Hit_Count', 0)


        // setTimeout(() => {
        //     console.log(`Deleting key`);
        // }, redis_expiry_time * 1000);


        res.send(`Successfully sent to Redis`)

    } catch (error) {
        console.log(`caught an error`, error);
    }
})

APP_CONTROLLER.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    const key = `USERS_${id}`;

    let cachedData: any = await client.get(key);

    if (cachedData) {
        console.log('Cache hit');
        return res.json({ message: 'From Redis', data: JSON.parse(cachedData) });
    }

    const user = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
    // await client.setEx(`USER_${id}`, 3600, JSON.stringify(user.data));

    res.json({ message: 'From API', data: user.data });
})