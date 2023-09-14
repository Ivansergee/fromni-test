const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();
const port = 3000;

const handlers = require('./handlers');


app.use(cors())
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/campaigns', handlers.getCampaigns);
app.get('/campaigns/:id', handlers.getCampaignById);
app.put('/campaigns/:id', handlers.updateCampaign);
app.post('/campaigns', handlers.createCampaign);
app.delete('/campaigns/:id', handlers.deleteCampaign);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});