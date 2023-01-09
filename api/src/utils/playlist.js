const playlist = [];

const addSong = (song, room) => {
  playlist.push({ video: song, room: room });
  shuffleArray(playlist);
};

const removeSong = (video, room) => {
  const index = playlist.findIndex((song) => song.video.videoId === video.videoId && song.room === room);
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

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

module.exports = { addSong, removeSong, getPlaylist, getFirstSong };
