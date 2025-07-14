// Serve forbidden polygons GeoJSON to the client
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

router.get('/forbidden-zones', (req, res) => {
  const geojsonPath = path.join(__dirname, 'generated-file-july-14-2025-3_06am.json');
  const geojson = fs.readFileSync(geojsonPath, 'utf8');
  res.setHeader('Content-Type', 'application/json');
  res.send(geojson);
});

module.exports = router;
