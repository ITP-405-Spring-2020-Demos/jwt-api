const express = require('express');
const bodyParser = require('body-parser');
const { Op } = require('sequelize');
const cors = require('cors');

const { Playlist, Track } = require('./models');

const app = express();

app.use(
  cors({
    origin: 'http://localhost:4200',
  })
);
app.use(bodyParser.json());

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
