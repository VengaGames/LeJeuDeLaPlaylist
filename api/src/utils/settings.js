const settings = [];

const initSettings = (room) => {
  settings.push({ room: room, audioEveryone: false });
};

const setSettings = (room, settingName, value) => {
  const index = settings.findIndex((setting) => setting.room === room);
  if (index !== -1) {
    settings[index][settingName] = value;
  }
};

const getSettings = (room) => {
  return settings.find((setting) => setting.room === room);
};

const removeRoom = (room) => {
  const index = settings.findIndex((setting) => setting.room === room);
  if (index !== -1) {
    return settings.splice(index, 1)[0];
  }
};

module.exports = {
  initSettings,
  setSettings,
  getSettings,
  removeRoom,
};
