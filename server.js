const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { Pool } = require("pg");

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

const pool = new Pool();

app.get("/", (req, res) => {
  res.json("Welcome to my API");
});

// app.get("/fighters", (req, res) => {
//   pool
//     .query("SELECT * FROM fighters;")
//     .then((data) => res.send(data.rows))
//     .catch((e) => res.sendStatus(500).send("Something went wrong"));
// });

//with async ,await

app.get("/fighters", async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM fighters;");
    res.send(data.rows);
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

// app.get("/fighters/:id", (req, res) => {
//   const { id } = req.params;
//   pool
//     .query("SELECT * FROM fighters WHERE id=$1;", [id])
//     .then((data) => res.json(data.rows[0]))
//     .catch((e) => res.sendStatus(500).json(e));
// });

//with async ,await

app.get("/fighters/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await pool.query("SELECT * FROM fighters WHERE id=$1;", [id]);
    res.json(data.rows[0]);
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

// app.delete("/fighters/:id", (req, res) => {
//   const { id } = req.params;
//   pool
//     .query("DELETE FROM fighters WHERE id=$1;", [id])
//     .then((data) => res.json(data.rows[0]))
//     .catch((e) => res.sendStatus(500).json(e));
// });

//with async ,await
app.delete("/fighters/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await pool.query("DELETE FROM fighters WHERE id=$1;", [id]);
    res.json(data.rows[0]);
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

//with async ,await

app.put("/fighters/:id", async (req, res) => {
  const fighterId = req.params.id;
  const { first_name, last_name, country_id, style } = req.body;

  try {
    // Update the fighter information in the database
    const query = `
          UPDATE fighters
          SET first_name = $1,
              last_name = $2,
              country_id = $3,
              style = $4
          WHERE id = $5
      `;
    const values = [first_name, last_name, country_id, style, fighterId];
    const result = await pool.query(query, values);

    // Check if the fighter was updated successfully
    if (result.rowCount === 1) {
      res.status(200).json({ message: "Fighter updated successfully" });
    } else {
      res.status(404).json({ message: "Fighter not found" });
    }
  } catch (error) {
    console.error("Error updating fighter:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// app.post("/fighters", (req, res) => {
//   const { first_name, last_name, country_id, style } = req.body;

//   pool
//     .query(
//       "INSERT INTO fighters (first_name, last_name, country_id, style) VALUES ($1, $2, $3, $4) RETURNING *",
//       [first_name, last_name, country_id, style]
//     )
//     .then((data) => res.json(data.rows))
//     .catch((e) => res.sendStatus(500).send(e));
// });

//with async ,await

app.post("/fighters", async (req, res) => {
  const { first_name, last_name, country_id, style } = req.body;

  try {
    const { rows } = await pool.query(
      "INSERT INTO fighters (first_name, last_name, country_id, style) VALUES ($1, $2, $3, $4) RETURNING *",
      [first_name, last_name, country_id, style]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

// app.get("/time", (req, res) => {
//   pool.query("SELECT NOW()", (err, response) => {
//     if (err) {
//       return res.status(500).send("Something went wrong");
//     }
//     res.send(response.rows[0]);
//   });
// });

//with async ,await

app.get("/time", async (req, res) => {
  try {
    const response = await pool.query("SELECT NOW()");
    res.send(response.rows[0]);
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});
