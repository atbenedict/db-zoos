const express = require("express");
const helmet = require("helmet");
const knex = require("knex");

const knexConfig = {
  client: "sqlite3",
  connection: {
    filename: "./data/lambda.sqlite3"
  },
  useNullAsDefault: true
};
const db = knex(knexConfig);

const server = express();

server.use(express.json());
server.use(helmet());

// list all zoos
server.get("/api/zoos", async (req, res) => {
  try {
    const zoos = await db("zoos");
    res.status(200).json(zoos);
  } catch (error) {
    res.status(500).json(error);
  }
});

const errors = {
  "19": "Another record with that value exists"
};

// list a zoo by id
server.get("/api/zoos/:id", async (req, res) => {
  try {
    const zoo = await db("zoos")
      .where({ id: req.params.id })
      .first();
    res.status(200).json(zoo);
  } catch (error) {
    res.status(500).json(error);
  }
});

// create a zoo
server.post("/api/zoos", async (req, res) => {
  try {
    const [id] = await db("zoos").insert(req.body);

    const zoo = await db("zoos")
      .where({ id })
      .first();

    res.status(201).json(zoo);
  } catch (error) {
    const message = errors[error.errno] || "We ran into an error";
    res.status(500).json({ message, error });
  }
});

// update a zoo
server.put("/api/zoos/:id", async (req, res) => {
  try {
    const count = await db("zoos")
      .where({ id: req.params.id })
      .update(req.body);

    if (count > 0) {
      const zoo = await db("zoos")
        .where({ id: req.params.id })
        .first();

      res.status(200).json(zoo);
    } else {
      res.status(404).json({ message: "Records not found" });
    }
  } catch (error) {}
});

// remove zoos (inactivate the zoo)
server.delete("/api/zoos/:id", async (req, res) => {
  try {
    const count = await db("zoos")
      .where({ id: req.params.id })
      .del();

    if (count > 0) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: "Records not found" });
    }
  } catch (error) {}
});

// list all bears
server.get("/api/bears", async (req, res) => {
  try {
    const bears = await db("bears");
    res.status(200).json(bears);
  } catch (error) {
    res.status(500).json(error);
  }
});

// list a bear by id
server.get("/api/bears/:id", async (req, res) => {
  try {
    const bear = await db("bears")
      .where({ id: req.params.id })
      .first();
    res.status(200).json(bear);
  } catch (error) {
    res.status(500).json(error);
  }
});

// create a bear
server.post("/api/bears", async (req, res) => {
  try {
    const [id] = await db("bears").insert(req.body);

    const bear = await db("bears")
      .where({ id })
      .first();

    res.status(201).json(bear);
  } catch (error) {
    const message = errors[error.errno] || "We ran into an error";
    res.status(500).json({ message, error });
  }
});

// update a bear
server.put("/api/bears/:id", async (req, res) => {
  try {
    const count = await db("bears")
      .where({ id: req.params.id })
      .update(req.body);

    if (count > 0) {
      const bear = await db("bears")
        .where({ id: req.params.id })
        .first();

      res.status(200).json(bear);
    } else {
      res.status(404).json({ message: "Records not found" });
    }
  } catch (error) {}
});

// remove bears (inactivate the bear)
server.delete("/api/bears/:id", async (req, res) => {
  try {
    const count = await db("bears")
      .where({ id: req.params.id })
      .del();

    if (count > 0) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: "Records not found" });
    }
  } catch (error) {}
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
