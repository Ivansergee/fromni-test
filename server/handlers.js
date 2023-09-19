const { Pool } = require('pg');
require('dotenv').config();


const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.HOST,
  database: process.env.DB_NAME,
  password: process.env.PASSWORD,
  port: process.env.PORT,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to PostgreSQL');
});


const getCampaigns = (req, res) => {
  pool.query('SELECT * FROM campaigns ORDER BY id DESC', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}

const getCampaignById = (req, res) => {
  id = parseInt(req.params.id)
  pool.query(
    `SELECT campaigns.id, campaigns.name,
    json_agg(
      json_build_object(
          'id', messages.id,
          'text', messages.text,
          'messenger', messengers.name,
          'keyboard_type', messages.keyboard_type,
          'order', messages."order",
          'buttons', (SELECT json_agg(
                        json_build_object(
                             'id', buttons.id,
                             'text', buttons.text,
                             'type', buttons.type))
                      FROM buttons
                      WHERE buttons.message_id = messages.id)
        )
    ) AS messages
    FROM campaigns
    JOIN messages ON messages.campaign_id = campaigns.id
    JOIN messengers ON messages.messenger_id = messengers.id
    WHERE campaigns.id = $1
    GROUP BY campaigns.id`,
    [id], (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).json(results.rows)
    })
}

const createCampaign = (req, res) => {
  const { name, messages } = req.body;

  pool.query('INSERT INTO campaigns (name) VALUES ($1) RETURNING id', [name])
    .then((result) => {
      const campId = result.rows[0].id;
      const messagePromises = [];

      messages.forEach((message) => {
        const messagePromise = pool.query(
          `INSERT INTO messages (campaign_id, messenger_id, text, keyboard_type, "order") VALUES ($1, $2, $3, $4, $5) RETURNING id`,
          [campId, message.messengerId, message.text, message.kbType, message.order])
          .then((result) => {
            const messageId = result.rows[0].id;
            const buttonPromises = [];

            message.buttons.forEach((button) => {
              const buttonPromise = pool.query('INSERT INTO buttons (message_id, text, type) VALUES ($1, $2, $3)', [messageId, button.text, button.type]);
              buttonPromises.push(buttonPromise);
            });

            return Promise.all(buttonPromises);
          });

        messagePromises.push(messagePromise);
      });

      return Promise.all(messagePromises);
    })
    .then(() => {
      res.status(201).json({message: 'кампания создана'})
    })
    .catch((error) => {
      if (error.code === '23505') {
        res.status(500).json({message: 'Кампания с таким именем уже существует'})
      } else {
        res.status(500).json({message: 'Ошибка сервера'})
      }
    });

}

const getMessengers = (req, res) => {
  pool.query('SELECT * FROM messengers ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }

    res.status(200).json(results.rows)
  })
}

module.exports = {
  getCampaigns,
  getCampaignById,
  createCampaign,
  getMessengers,
}