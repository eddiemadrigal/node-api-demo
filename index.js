const express = require("express");

const server = express();

let users = [
  {
    id: 1,
    name: "Eddie",
    bio: "Bio for Eddie"
  }
];

server.use(express.json());

// GET endpoints
server.get("/", (req, res) => {
  res.json({ api: "running ..." })
});

server.get("/api/users", (req, res) => {
  if (users) {
    res
    .json(users);
  } else {
    res
    .status(500)
    .json({ errorMessage: "The users information could not be retrieved." })
  }
});

server.get("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const user = users.find( user => user.id == id);

  if (user) {
    res
      .status(200)
      .json(user);
  } else if (!users) {
    res
      .status(404)
      .json({ message: "The user with the specified ID does not exist." })
  } else {
    res
      .status(500)
      .json({ errorMessage: "The user info could not be retrieved." })
  }
});

// POST endpoints

server.post("/api/users", (req, res) => {
  const userInfo = req.body;

  if (userInfo.name == "" || userInfo.bio == "") {
    res
      .status(400)
      .json({ message: "Please provide a name and bio for the user" })
  } else if (userInfo.name != "" || userInfo.bio != "") {
    users
      .push(userInfo);
    res
      .status(201)
      .json(users);
  } else {
    res
    .status(500)
    .json({ errorMessage: "There was an error while saving the user to the database" })
  }
  
});

// DELETE endpoints

server.delete("/api/users/:id", (req, res) => {

  let userId = req.params.id;

  let user = users.filter( user => {
    return user.id == userId;
  })[0];

  if (user) {
    const index = users.indexOf(user);
    users.splice(index, 1);
    res
      .json({ message: `User ${userId} has been deleted.` });
  } else if (!user) {
    res
      .status(404)
      .json({ message: `The user with the specified ID does not exist.` })
  } else {
    res
      .status(500)
      .json({ errorMessage: `The user could not be removed.` })
  }

})

// PUT requests

server.put("/api/users/:id", (req, res) => {
    
  const updateUser = req.body;
  const userId = req.params.id;
  const oldUser = users.find(i => i.id === Number(userId));

  if (users.find(i => i.id == (userId))) {
    if (req.body.name.length > 0 || req.body.bio.length > 0) {
      if (oldUser === updateUser) {
        res.status(500).json({ errorMessage: "The user information could not be found." })
      } else {
        updateUser.id = users.length
        users = [
          ...users.slice(0, oldUser.id),
          updateUser,
          users.slice(oldUser.id + 1)
        ]
        res.status(200).json(users)
      }
    } else {
      res.status(400).json({ errorMessage: "Please provide a name and bio for the user." })
    }
  } else {
    res.status(404).json({ message: "The user with the specified id does not exist" })
  }
})

const port = 5000;

server.listen(port, () => console.log(`\n Server running on host: localhost:${port}`));