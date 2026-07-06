const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Yogi@#19",
    database: "smarttodo"
});

db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("MySQL Connected");
    }
});


app.post("/addTask", (req, res) => {

    const {
        title,
        day_name,
        priority,
        due_date,
        status
    } = req.body;

    const sql =
    `INSERT INTO tasks
    (title, day_name, priority, due_date, status)
    VALUES (?, ?, ?, ?, ?)`;

    db.query(
        sql,
        [
            title,
            day_name,
            priority,
            due_date,
            status
        ],
        (err, result) => {

            if(err){
                console.log(err);
                res.send("Error");
            } else {
                res.send("Task Added Successfully");
            }

        }
    );
});
app.get("/tasks", (req, res) => {

    db.query(
        "SELECT * FROM tasks",
        (err, result) => {

            if(err){
                res.send(err);
            } else {
                res.json(result);
            }

        }
    );
});

app.get("/", (req, res) => {
    res.send("Smart To-Do Backend Running");
});
app.delete("/deleteTask/:id", (req, res) => {

    const id = req.params.id;

    db.query(
        "DELETE FROM tasks WHERE id = ?",
        [id],
        (err, result) => {

            if(err){
                res.send(err);
            } else {
                res.send("Task Deleted");
            }

        }
    );

});

app.put("/updateTask/:id", (req, res) => {

    const id = req.params.id;

    const {
        title,
        day_name,
        priority,
        due_date,
        status
    } = req.body;

    const sql =
    `UPDATE tasks
     SET title=?,
         day_name=?,
         priority=?,
         due_date=?,
         status=?
     WHERE id=?`;

    db.query(
        sql,
        [
            title,
            day_name,
            priority,
            due_date,
            status,
            id
        ],
        (err, result) => {5

            if(err){
                res.send(err);
            } else {
                res.send("Task Updated Successfully");
            }

        }
    );
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});