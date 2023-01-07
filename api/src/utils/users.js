const users = [];

function addUser({ id, name, room }) {
  console.log(users);
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find((user) => user.room === room && user.name === name);
  if (existingUser) {
    return { error: "User is taken" };
  }
  if (users.length === 0) {
    const user = { id, name, room, admin: true };
    users.push(user);
    return { user };
  }
  const user = { id, name, room, admin: false };
  users.push(user);

  return { user };
}

function removeUser(id) {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
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

module.exports = { addUser, modifyUser, removeUser, getUser, getUsersInRoom };
