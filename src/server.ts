import bodyParser from 'body-parser';
import express from 'express';
import path from 'path';

import getClassData from './index';

const awaitHandler = (middleware: any) => {
    return async (req: any, res: any, next: any) => {
        try {
            await middleware(req, res, next);
        } catch (err) {
            next(err);
        }
    };
};
const app = express();
const port = 80;

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/static', express.static(path.join(__dirname, '/../src/public')));

app.get('/', (req, res) => {
    res.sendFile('/src/public/html/index.html', { root: __dirname + '/..' });
});

app.post('/submit', awaitHandler(async (req: any, res: any) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send({ message: 'You left a field empty.. why?' });
    }
    try {
        const classData = await getClassData(username, password);
        return res.send(classData);
    } catch (err) {
        return res.status(500).send(err.message);
    }
}));

app.get('*', (req, res) => {
    res.status(401).send('<h1>404: not found boss<h1>');
});

app.listen(port, '0.0.0.0', () => console.log(`Example app listening on port ${port}!`));
