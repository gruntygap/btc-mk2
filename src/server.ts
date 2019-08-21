import bodyParser from 'body-parser';
import express from 'express';
import getClassData from './index';

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile('/src/templates/index.html', { root: __dirname + '/..' });
});

app.post('/submit', async (req, res) => {
    const { username, password } = req.body;
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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
