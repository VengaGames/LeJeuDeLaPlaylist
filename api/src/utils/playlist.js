const playlist = [];

const addSong = (song, room) => {
  playlist.push({ video: song, room: room });
};

const removeSong = (video, room) => {
  const index = playlist.findIndex((song) => song.video.id.videoId === video.id.videoId && song.room === room);
  if (index !== -1) {
    return playlist.splice(index, 1)[0];
  }
};

const getFirstSong = (room) => {
  return playlist.find((song) => song.room === room);
};

const getPlaylist = (room) => {
  return playlist.filter((song) => song.room === room);
};

module.exports = { addSong, removeSong, getPlaylist, getFirstSong };
