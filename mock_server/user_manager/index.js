const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const auth = require('./auth.js');

const app = express();
const USER_MANAGER_PORT = 10002;

app.use(bodyparser.json({ limit: '50mb' }));
app.use(cors())

app.post('/login', (req, res) => {
    const users = require('./static/users.json');
    for (const user of users) {
        if (user.email == req.body.email && user.password == req.body.password) {
            res.send({
                user: {
                    access: auth.generateAccessToken(user),
                    email: user.email,
                    id: user.id,
                    name: user.name,
                    surname: user.surname,
                    zerynth_api_key: user.zerynth_api_key
                }
            });
            return;
        }
    }
    res.status(401).send({
        "message": "Wrong credentials"
    });
});

app.get('/user', (req, res) => {
    const userId = req.query.id;
    const users = require('./static/users.json');
    for (const user of users) {
        if (user.id == userId) {
            res.send({
                email: user.email,
                id: user.id,
                idz: "id-zer",
                name: user.name,
                surname: user.surname,
                zerynth_api_key: user.zerynth_api_key
            });
            return;
        }
    }
    res.status(404).send({
        "message": "User not found"
    });
});

app.listen(USER_MANAGER_PORT, () => console.log('start user manager mock server...'));