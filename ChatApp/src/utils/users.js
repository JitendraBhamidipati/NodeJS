const users = [];

const addUser = ({ id, userName, room }) => {
  if (!userName || !room) {
    return {
      error: "Username and room required"
    };
  }
  userName = userName.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find(
    user => user.room === room && user.userName === userName
  );
  if (existingUser)
    return {
      error: "Username is already in use! Please try another"
    };

  const user = { userName, room, id };
  users.push(user);
  return { user };
};

const removeUser = id => {
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = id => users.find(user => user.id === id);

const getUsersInRoom = room => {
  room = room.trim().toLowerCase();
  return users.filter(user => user.room === room);
};

// addUser("1", "Jitendra", "201");
// addUser("2", "Andrew", "201");
// addUser("3", "Smith", "201");
// addUser("4", "Smith", "202");
// removeUser("2");
// console.log(getUser("2"));
// console.log(getUsersInRoom("202"));

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
};
