const playlist = [];

const addSong = (song) => {
  playlist.push(song);
};

const removeSong = (video) => {
  const index = playlist.findIndex((song) => song.id.videoId === video.id.videoId);
  if (index !== -1) {
    return playlist.splice(index, 1)[0];
  }
};

const getPlaylist = () => {
  return playlist;
};

module.exports = { addSong, removeSong, getPlaylist };
