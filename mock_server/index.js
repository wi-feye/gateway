const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const auth = require('./auth.js');
const app = express();

app.use(bodyparser.json({ limit: '50mb' }));
app.use(cors())

app.post('/api/auth/login', (req, res) => {
    const users = require('./static/users.json');
    for (const user of users) {
        if (user.email == req.body.email && user.password == req.body.password) {
            res.send({
                status: true,
                jwt: auth.generateAccessToken(user),
            });
        }
    }
    res.status(400).send('user not found');
});

app.get('/api/auth/user', auth.authenticateToken, (req, res) => {
    const user = req.user;
    res.send({
        id: user.id,
        id_zerynth: user.id_zerynth,
        apikey_zerynth: user.apikey_zerynth,
        name: user.name,
        surname: user.surname,
        email: user.email,
    });
});

app.get('/api/building/list', auth.authenticateToken, (req, res) => {
    const buildings = require('./static/buildings.json').filter(b => b.id_user == req.user.id);
    res.send(buildings);
});

app.get('/api/:id_building/area/list', auth.authenticateToken, (req, res) => {
    const areas = require('./static/areas.json').filter(a => a.id_building == req.params.id_building);
    res.send(areas);
});

app.get('/api/:id_building/sniffer/list', auth.authenticateToken, (req, res) => {
    const areas = require('./static/sniffers.json').filter(s => s.id_building == req.params.id_building);
    res.send(areas);
});

app.get('/api/:id_building/positions/list', auth.authenticateToken, (req, res) => {
    var positions = require('./static/positions.json').filter(s => s.id_building == req.params.id_building);
    if (req.query.start != undefined) {
        positions = positions.filter(s => new Date(req.query.start) <= new Date(s.timestamp));
    }
    if (req.query.end != undefined) {
        positions = positions.filter(s => new Date(s.timestamp) < new Date(req.query.end));
    }
    res.send(positions);
});

app.listen(8000, () => console.log('start server...'));