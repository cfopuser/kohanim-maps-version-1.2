const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const path = require('path');

const GH_KEY = process.env.GRAPHHOPPER_API_KEY;
if (!GH_KEY) {
  console.error('Please set GRAPHHOPPER_API_KEY in .env');
  process.exit(1);
}




const fs = require('fs');
const forbiddenGeojson = JSON.parse(fs.readFileSync(path.join(__dirname, 'generated-file-july-14-2025-3_06am.json'), 'utf8'));
const forbiddenPolygons = forbiddenGeojson.features.filter(f => f.geometry && f.geometry.type === 'Polygon');


const app = express();
app.use(bodyParser.json());


const forbiddenZonesRouter = require('./forbidden-zones');
app.use('/api', forbiddenZonesRouter);


const clientPath = path.join(__dirname, '../client');
app.use(express.static(clientPath));


app.get('/', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});


app.post('/route', async (req, res) => {
  const { points } = req.body;
  if (!Array.isArray(points) || points.length < 2) {
    return res.status(400).json({ error: 'points must be an array of at least two [lat,lon] pairs' });
  }


  const exclusionZones = forbiddenPolygons;

 const priorityEntries = exclusionZones.map((poly) => ({
  if: [{ in_polygon: { polygon: poly.geometry.coordinates } }],
  multiply_by: 0
}))


const ghPayload = {

  points,

  
  profile: "car",


  algorithm: "alternative_route",


  locale: "en",
  instructions: true,


  calc_points: true,
  points_encoded: false,
}


  try {
    const ghRes = await fetch(
      `https://graphhopper.com/api/1/route?key=${GH_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ghPayload)
      }
    );
    const ghJson = await ghRes.json();
    res.json(ghJson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'GraphHopper request failed' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
