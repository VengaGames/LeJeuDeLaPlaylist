const users = [];

function addUser({ id, name, room }) {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find((user) => user.room === room && user.name === name);
  if (existingUser) {
    return { error: "User is taken" };
  }
  const user = { id, name, room };
  users.push(user);

  return { user };
}

function removeUser(id) {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

function getUser(id) {
  return users.find((user) => user.id === id);
}

function getUsersInRoom(room) {
  return users.filter((user) => user.room === room);
}

function getAdmin({ room }) {
  for (let i = 0; i < users.length; i++) {
    // console.log(users[i].room);
    // console.log(room);
    if (users[i].room === room) {
      return users[i];
    }
  }
}

module.exports = { addUser, removeUser, getUser, getUsersInRoom, getAdmin };
