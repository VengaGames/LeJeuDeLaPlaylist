const { initSettings, removeRoom } = require('../utils/settings');
const users = [];

function addUser({ id, name, room }) {
  name = name.trim();
  room = room.trim();

  const existingUser = users.find((user) => user.room === room && user.name === name);
  if (existingUser) {
    return { error: 'User is taken' };
  }

  const usersInThisRoom = getUsersInRoom(room);
  if (usersInThisRoom.length === 0) {
    initSettings(room);
  }

  if (usersInThisRoom.length === 0 || usersInThisRoom.every((user) => user.admin === false)) {
    const user = { id, name, room, admin: true };
    users.push(user);
    return { user };
  }
  const user = { id, name, room, admin: false };
  users.push(user);

  return { user };
}

function getRooms() {
  let rooms = users.map((user) => user.room);
  rooms = [...new Set(rooms)];

  const usersNbInRooms = rooms.map((room) => getUsersInRoom(room)).map((users) => users.length);
  return rooms.map((room, index) => ({ name: room, usersNb: usersNbInRooms[index] }));
}

function removeUser(id) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    if (users[index].admin) {
      const usersInRoom = getUsersInRoom(users[index].room);
      usersInRoom[1] ? (usersInRoom[1].admin = true) : null;
    }

    const usersInRoom = getUsersInRoom(users[index].room);
    if (usersInRoom.length === 1) {
      removeRoom(users[index].room);
    }
    return users.splice(index, 1)[0];
  }
}

function modifyUser(id, key, value) {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    users[index][key] = value;
  }
}

function getUser(id) {
  return users.find((user) => user.id === id);
}

function getUsersInRoom(room) {
  return users.filter((user) => user.room === room);
}

module.exports = { addUser, modifyUser, removeUser, getUser, getUsersInRoom, getRooms };
