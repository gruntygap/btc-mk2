import bodyParser from 'body-parser';
import { parse, getDay } from 'date-fns';
import express from 'express';
import path from 'path';

import getClassData from './index';

const app = express();
const port = 8000;
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/static', express.static(path.join(__dirname, '/../src/public')));

app.get('/', (req, res) => {
    const dowConfirm: any = {
        MO: 1,
        TU: 2,
        WE: 3,
        TH: 4,
        FR: 5,
    };
    console.log(parse('Sep 03, 2019', 'MMM dd, yyyy', new Date()));
    console.log(parse('Sep 01, 2019', 'MMM dd, yyyy', new Date()).getDay());
    res.sendFile('/src/public/html/index.html', { root: __dirname + '/..' });
});

app.post('/submit', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).send({ message: 'You left a field empty.. why?' });
    }
    try {
        const classData = await getClassData(username, password);
        res.send(classData);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get('*', (req, res) => {
    res.status(401).send('HUH? Did you get that URL right?');
});

app.listen(port, '0.0.0.0', () => console.log(`Example app listening on port ${port}!`));
