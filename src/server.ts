import compression from 'compression';
import express from 'express';
import fs from 'fs';
import http from 'http';
import https from 'https';
import path from 'path';

// Local
import getClassData from './index';

// Middleware
import bodyParser from 'body-parser';
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
let port = 8000;

// http -> https middleware
// TODO: look into helmet
if (process.env.NODE_ENV === 'production') {
    // http -> https middleware
    // TODO: look into helmet
    app.use((req, res, next) => {
        if (req.secure) {
            next();
        } else {
            res.redirect(`https://${req.headers.host}${req.url}`);
        }
    });
    app.use(compression());
}
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, '/../src/public')));

// Nothing to show on index, so send to app
app.get('/', (req, res) => {
    res.redirect(307, '/banner-to-calendar');
});

app.get('/banner-to-calendar', (req, res) => {
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

// Starting http & https servers according to Env.
if (process.env.NODE_ENV === 'production') {
    port = 80;
    // Create Certificate
    const privateKey = fs.readFileSync('/etc/letsencrypt/live/grantgap.me/privkey.pem', 'utf8');
    const certificate = fs.readFileSync('/etc/letsencrypt/live/grantgap.me/cert.pem', 'utf8');
    const ca = fs.readFileSync('/etc/letsencrypt/live/grantgap.me/chain.pem', 'utf8');
    const credentials = {
        ca,
        cert: certificate,
        key: privateKey,
    };
    const httpsServer = https.createServer(credentials, app);
    httpsServer.listen(443, () => {
        console.log('HTTPS Server running on port 443');
    });
}

// This will be the primary server if developing, but the redirecting server to https if prod
const httpServer = http.createServer(app);
httpServer.listen(port, () => {
    console.log(`HTTP Server running on port ${port}`);
});
