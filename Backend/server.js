const express = require('express');
const app = express();
const authenRouter = require('./routes/authenRoute');

app.use(express.json());
app.use('/api', authenRouter);


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

