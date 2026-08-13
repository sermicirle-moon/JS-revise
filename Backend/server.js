const express = require('express');
const pool = require('./config/db');
const app = express();

app.get('/users', async (req, res) =>{
    try{
        const result = await pool.query('SELECT * FROM "TEST".users');
        res.json(result.rows);
    }
    catch (error){
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});

app.get('/users/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const result = await pool.query('SELECT * FROM "TEST".users WHERE id = $1', [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
    if(pool){
        console.log('Database connection established');
    }
    console.log('Database connection pool:', pool);
});

