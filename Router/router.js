const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const methodOverrider = require("method-override");
const router = express.Router();
// Connection Pool
let con = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "root",
    password: "",
    database: "node"
});

// Setting middlewares
router.use(methodOverrider("_method"))
router.use(bodyParser.urlencoded({ extended: true }));

// Route Handelers
const getHome = (req, res) => {
    let result = [{
        id: null,
        email: null,
        name: null,
        address1: null,
        address2: null,
        city: null,
        zip: null,
    }]
    res.render('index', { result, action: "/", title: "Home" });
}

const postHome = (req, res) => {
    let { email, name, address, address2, city, zip } = req.body;
    address2 = address2 == "" ? "NULL" : address2;
    var sql = `INSERT INTO curd_app (id, email, name, address1, address2, city, zip) VALUES (null, '${email}', '${name}', '${address}','${address2}', '${city}', '${zip}');`
    con.query(sql, (err, res) => {
        if (err) throw err;
    });
    let result = [{
        id: null,
        email: null,
        name: null,
        address1: null,
        address2: null,
        city: null,
        zip: null,
    }]
    res.render("index", { result, action: "/", title: "Home" });
}

const getRecords = (req, res) => {
    let sql = `select * from curd_app`;
    con.query(sql, (err, result) => {
        if (err) throw err;
        else {
            res.render("records", {
                result
            })
        }
    });
}

const getEdit = (req, res) => {
    const id = req.query.id * 1;
    let sql = "select * from curd_app where curd_app.id = ?"
    con.query(sql, id, (err, result) => {
        if (err) throw err
        else {
            res.render("index", { result, action: "/edit", title: "Edit" });
        }
    });
}

const putEdit = (req, res) => {
    let { email, name, address, address2, city, zip, id } = req.body;
    id = id * 1;
    let sql = "update curd_app set email = ?, name = ?, address1 =  ?, address2 = ?, city = ?, zip = ? where curd_app.id = ?";
    con.query(sql, [email, name, address, address2, city, zip, id], (err, result) => {
        if (err) throw err;
        else {
            res.redirect(200, "records");
        }
    });
}

const getView = (req, res) => {
    const id = req.query.id * 1;
    let sql = "select * from curd_app where curd_app.id = ?";
    con.query(sql, id, (err, result) => {
        if (err) throw err
        else
            res.render("person", { result });
    });
}

const deleteRecord = (req, res) => {
    const id = req.params.id;
    let sql = "DELETE FROM `curd_app` WHERE `curd_app`.`id` = ?"
    con.query(sql, id, (err, result) => {
        if (err) throw err
        else {
            res.redirect(200, "/records");

        }
    })

}

//Main Routers
router.route("")
    .get(getHome)
    .post(postHome)
router.route("/records")
    .get(getRecords);
router.route("/edit")
    .get(getEdit)
    .put(putEdit);
router.get("/view", getView);
router.delete("/records/:id", deleteRecord);



module.exports = router;