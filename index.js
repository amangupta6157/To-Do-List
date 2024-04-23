import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db=new pg.Client({
  user:"postgres",
  host:"localhost",
  database:"permalist",
  password:"A#007",
  port:5432,
});
db.connect();

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {
  items=(await db.query("SELECT * FROM items")).rows;
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  console.log(item);
  await db.query("INSERT INTO items (title) VALUES ($1)",[item]);
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  await db.query("UPDATE items SET title=($2) WHERE id=($1)",[req.body.updatedItemID,req.body.updatedItemTitle]);
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
await db.query("DELETE FROM items WHERE id=($1)",[req.body.deleteItemId]);
res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
