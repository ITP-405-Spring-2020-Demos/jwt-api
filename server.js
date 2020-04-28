require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const { Op } = require('sequelize');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const { Playlist, Track } = require('./models');

const app = express();

app.use(
  cors({
    origin: 'http://localhost:4200',
  })
);
app.use(bodyParser.json());

app.post('/api/token', async function (request, response) {
  const { username, password } = request.body;

  if (username === 'dtang' && password === 'password') {
    const token = jwt.sign({ id: 0, name: 'David' }, process.env.JWT_SECRET);
    response.json({ token });
  } else {
    response.status(401).send();
  }
});

app.get('/api/playlists', async function (request, response) {
  const filter = {};
  const { q } = request.query;

  if (q) {
    filter = {
      where: {
        name: {
          [Op.like]: `${q}%`,
        },
      },
    };
  }

  const playlists = await Playlist.findAll(filter);
  response.json(playlists);
});

app.get('/api/playlists/:id', async function (request, response) {
  const { id } = request.params;

  const playlist = await Playlist.findByPk(id, {
    include: [Track],
  });

  if (playlist) {
    response.json(playlist);
  } else {
    response.status(404).send();
  }
});

app.listen(process.env.PORT || 8080);
