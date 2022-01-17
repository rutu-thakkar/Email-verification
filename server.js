const express = require('express');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 3000
const apiRoutes = require('./routes/apiRoutes');
const db = require('./models');

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cors());
app.use('/', apiRoutes);

db.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`server listening on http://localhost:${port}`)
    })
}).catch((error) => {
    console.log("something went wrong!" + error)
})