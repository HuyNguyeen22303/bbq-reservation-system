import express, { Request, Response } from 'express';
import appClient from './routes/client/client.route';
import 'dotenv/config'
import path from 'path';
const app = express();
const port = process.env.PORT || 9000;



app.use(express.json()); // Read data json
app.use(express.urlencoded({ extended: true })); // Read data from HTML Form (POST request)



app.use(express.static(path.join(__dirname, '../public'))); // config file static public

app.set('views', path.join(__dirname, 'views'));  // config views

app.set('view engine', 'ejs') // config ejs


app.use("/", appClient); // route app client



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
