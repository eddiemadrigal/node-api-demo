const express = require("express");

const server = express();

let users = [
  {
    id: 1,
    name: "Eddie Madrigal",
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

  const index = users.indexOf(user);

  users.splice(index, 1);

  res
    .json({ message: `User ${userId} has been deleted.` })

})

const port = 5000;

server.listen(port, () => console.log(`\n Server running on host: localhost:${port}`));