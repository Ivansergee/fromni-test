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

app.get('/campaigns', handlers.getCampaigns);
app.get('/campaigns/:id', handlers.getCampaignById);
app.post('/campaigns', handlers.createCampaign);
app.get('/messengers', handlers.getMessengers);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});