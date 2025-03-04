import express, { Request, Response } from 'express';
import * as fs from 'fs/promises';

const app = express();
app.use(express.json());

app.post('/webhook', async (req: Request, res: Response) => {
    const payload = req.body;
    const headers = req.headers;

    console.log('recieved payload:', payload);
    console.log('recieved headers:', headers);

    try {
        await fs.writeFile('headers.json', JSON.stringify(payload, null, 2));
        console.log('payload saved to payload.json')
    } catch (err) {
        console.error('error saving the payload:', err);
    }

    const secretMessage =
        payload.secret ||
        payload.code ||
        payload.secret?.message || // incase its nested
        payload.secretMessage || // camelCase check
        payload.secretCode || // checks out this phrasing 
        headers['x-secret'] ||
        headers['secret'] || //  check if secret is in the headers? unless its supposed to be blank
        'no secret found';
    console.log('secret message:', secretMessage);

    res.status(200).send('payload received');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`)
});