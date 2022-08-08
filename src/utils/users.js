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
    }

    // validate id
    const uniqueId = users.find(user => {
        return user.id === id;
    });

    if (uniqueId){
        return {
            error: "User Id must be unique!"
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

console.log(user2)

const user3 = addUser({
    id: 101,
    username: 'Roland',
    room: 'Bojo'
});
console.log(user3);
    
const user4 = addUser({
    id: 102,
    username: 'Rolly',
    room: 'Bojo'
});

console.log(user4);
console.log(users);

