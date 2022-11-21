const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');

const app = express();
const DATA_MANAGER_PORT = 10001;

app.use(bodyparser.json({ limit: '50mb' }));
app.use(cors())

app.get('/api/buildings/pull/:userId', (req, res) => {
    const userId = parseInt(req.params.userId);
    const buildings = require('./static/buildings.json').filter(b => b.id_user === userId);
    res.send(buildings);
});

app.get('/api/areas/pull/:buildingId', (req, res) => {
    const buildingId = parseInt(req.params.buildingId);
    const areas = require('./static/areas.json').filter(a => a.id_building === buildingId);
    res.send(areas);
});

app.get('/api/sniffers/pull/:buildingId', (req, res) => {
    const buildingId = parseInt(req.params.buildingId);
    const sniffers = require('./static/sniffers.json').filter(s => s.id_building === buildingId);
    res.send(sniffers);
});

app.listen(DATA_MANAGER_PORT, () => console.log('start data manager mock server...'));