const express = require("express");

const server = express();

const shortid = require('shortid');

let users = [];

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
  let userInfo = req.body;
  userInfo.id = shortid.generate();

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
    
  const userId = req.params.id;

  let user = users.filter( user => {
    return user.id == userId;
  })[0];

  if (!user) {
    res
      .status(404)
      .json({ message: "The user with the specified ID does not exist." })
  } else if (req.body.name == "" || req.body.bio == "") {
    res
      .status(400)
      .json({ errorMessage: "Please provide a name and bio for the user." })
  } else if (user) {
    user.name = req.body.name;
    user.bio = req.body.bio;

    res
      .status(200)
      .json({ message: `User ${userId} updated successfully.` })
  } else {
    res
      .status(500)
      .json({ errorMessage: "The user information could not be modified." })
  }

})

const port = 5000;

server.listen(port, () => console.log(`\n Server running on host: localhost:${port}`));