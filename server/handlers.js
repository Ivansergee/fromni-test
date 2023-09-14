const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '9371',
  port: 5432,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to PostgreSQL');
});



const getCampaigns = (req, res) => {
  pool.query('SELECT * FROM campaigns ORDER BY id ASC', (error, results) => {
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
          'buttons', (SELECT json_agg(
                        json_build_object(
                             'id', buttons.id,
                             'text', buttons.text))
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
  const { name } = req.body

  pool.query('INSERT INTO campaigns (name) VALUES ($1) RETURNING *', [name], (error, results) => {
    if (error) {
      throw error
    }
    res.status(201).json(results.rows)
  })
}

const updateCampaign = (req, res) => {
  const id = parseInt(req.params.id);
  const {name} = req.body
  pool.query('UPDATE campaigns SET name = $1 WHERE id = $2 RETURNING *', [name, id], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}

const deleteCampaign = (req, res) => {
  id = parseInt(req.params.id)
  pool.query('DELETE FROM campaigns WHERE id = $1 RETURNING *', [id], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}

const createCampMessage = (req, res) => {
  const { name } = req.body

  pool.query('INSERT INTO campaigns (name) VALUES ($1) RETURNING *', [name], (error, results) => {
    if (error) {
      throw error
    }
    res.status(201).json(results.rows)
  })
}

const updateCampMessage = (req, res) => {
  const id = parseInt(req.params.id);
  const {name} = req.body
  pool.query('UPDATE campaigns SET name = $1 WHERE id = $2 RETURNING *', [name, id], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}

const deleteCampMessage = (req, res) => {
  id = parseInt(req.params.id)
  pool.query('DELETE FROM campaigns WHERE id = $1 RETURNING *', [id], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}

module.exports = {
    getCampaigns,
    getCampaignById,
    updateCampaign,
    createCampaign,
    deleteCampaign,
}