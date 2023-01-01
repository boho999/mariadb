const express = require("express");
const pool = require('../helpers/database');
const router = express.Router();
const bcrypt = require("bcrypt");

router.get('/:id', async function(req,res) {

    try {
        const sqlQuery = 'SELECT id, email, password, created_at FROM user WHERE id=?';
        const rows = await pool.query(sqlQuery, req.params.id);
        res.status(200).json(rows);

    } catch (error) {
        res.status(400).send(error.message);
    }
    
})

router.post('/register', async function(req,res){
    try {
        const {email, password} = req.body;
        console.log(email, password);
        const encryptedPassword = await bcrypt.hash(password, 10);

        const sqlQuery= 'INSERT INTO user (email, password) VALUES (?,?)';
        const result = await pool.query(sqlQuery,[email, encryptedPassword]);

        res.status(200).json({userid: result.insertId.toString()});

    } catch (error) {
        res.status(400).send(error.message);
    }
})

router.post('/login', async function(req,res){
    try {
        const {email, password} = req.body;
        
        const sqlQuery = 'SELECT password from user WHERE email = ?';
        
        const result = await pool.query(sqlQuery, [email]);
        const isValid = await bcrypt.compare(password, result[0].password);        
        res.status(200).json({valid: isValid});
    } catch (error) {
        res.status(400).send(error.message);
    }
})

module.exports = router;
