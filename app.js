const express = require('express');
const bodyParser = require('body-parser');
const Playlist = require('./models/playlist');
const Track = require('./models/track');
const Sequelize = require('sequelize');

const { Op } = Sequelize;
const app = express();

app.use(bodyParser.json());

Playlist.belongsToMany(Track, {
  through: 'playlist_track',
  foreignKey: 'PlaylistId',
  timestamps: false
});

Track.belongsToMany(Playlist, {
  through: 'playlist_track',
  foreignKey: 'TrackId',
  timestamps: false
});

app.get('/api/playlists', async function(request, response) {
  const filter = {};
  const { q } = request.query;

  if (q) {
    filter = {
      where: {
        name: {
          [Op.like]: `${q}%`
        }
      }
    };
  }

  const playlists = await Playlist.findAll(filter);
  response.json(playlists);
});

app.get('/api/playlists/:id', async function(request, response) {
  const { id } = request.params;

  const playlist = await Playlist.findByPk(id, {
    include: [Track]
  });

  if (playlist) {
    response.json(playlist);
  } else {
    response.status(404).send();
  }
});

app.listen(process.env.PORT || 8000);
