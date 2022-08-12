// addUsers (when a user join), removeUser (when a user leaves the room), getUser, getUsersInARoom
const users = [];

const addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // validate that input are not empty
    if (!username || !room){
        return {
            error: "Username and Room must be provided"
        }
    };

    // username must be unique in each room
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username;
    });

    // validate existing user
    if (existingUser){
        return {
            error: "Username is already in use!"
        }
    };

    const user = {id, username, room};
    users.push(user)
    return {user}
};

addUser({
    id: 201,
    username: 'Roland',
    room: 'Ajax'
});

const user2 = addUser({
    id: 202,
    username: 'Ropo',
    room: 'Ajax'
});

const user3 = addUser({
    id: 101,
    username: 'Roland',
    room: 'Bojo'
});
    
const user4 = addUser({
    id: 102,
    username: 'Rolly',
    room: 'Bojo'
});

const removeUser = (id) => {
    
    // Check if user id exist in the storage
    const index = users.findIndex(user => user.id == id)

    if (index !== -1){
        return users.splice(index, 1)[0];
    }
}

const getUser = (id) => {
    return users.find(user => user.id === id);
}

const getUsersInRoom = (room) => {
    return users.filter(user => user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}