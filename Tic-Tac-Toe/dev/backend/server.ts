import express = require('express')
import path = require('path');
const app = express()
const port = 3000

app.use(express.static(path.join(__dirname, '..', 'frontend')))
app.get('/', async(req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'game.html'));
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})