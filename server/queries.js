const { Pool } = require('pg');

const pool = new Pool({
  user: 'ivan',
  host: 'localhost',
  database: 'fromni',
  password: '9371',
  port: 32768,
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
    `SELECT * FROM campaigns
    JOIN messages ON campaigns.id = messages.campaign_id
    WHERE campaigns.id = $1`,
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