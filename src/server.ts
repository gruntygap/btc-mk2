import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('yeet');
});

app.post('/submit', (req, res) => {
    res.send('POST request to the homepage');
  })

app.get('*', (req, res) => {
    res.status(401).send('HUH? Did you get that URL right?');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
