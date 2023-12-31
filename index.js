const express = require('express');
const connectToMongo=require('./db');
const cors = require('cors');
const app = express();
const port = 5000;

connectToMongo();

app.use(express.json());
app.use(cors());

app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(port, () => {
  console.log(`iNotebook app listening on http://localhost:${port}`)
});