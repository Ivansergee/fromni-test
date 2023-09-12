const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const db = require('./queries')


app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/campaigns', db.getCampaigns);
app.get('/campaigns/:id', db.getCampaignById);
app.put('/campaigns/:id', db.updateCampaign);
app.post('/campaigns', db.createCampaign);
app.delete('/campaigns/:id', db.deleteCampaign);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});