import bodyParser from 'body-parser';
import express from 'express';
import path from 'path';

import getClassData from './index';

const app = express();
const port = 8000;
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/static', express.static(path.join(__dirname, '/../src/public')));

app.get('/', (req, res) => {
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
    res.status(401).send('<h1>404: not found boss<h1>');
});

app.listen(port, '0.0.0.0', () => console.log(`Example app listening on port ${port}!`));
