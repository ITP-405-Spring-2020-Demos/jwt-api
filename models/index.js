const Playlist = require('./playlist');
const Track = require('./track');

Playlist.belongsToMany(Track, {
  through: 'playlist_track',
  foreignKey: 'PlaylistId',
  timestamps: false,
});

Track.belongsToMany(Playlist, {
  through: 'playlist_track',
  foreignKey: 'TrackId',
  timestamps: false,
});

module.exports = {
  Playlist,
  Track,
};
