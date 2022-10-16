var express = require('express')
var app = express()
require('dotenv').config()
const { IgApiClient } = require('instagram-private-api');
const { writeFile, readFile, access, link, unlink } = require('fs/promises');
const path = require('path')
const sessionController = require('./controller/sessionController')
const ig = new IgApiClient();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//login route
app.post('/login', sessionController.signin)

//logout route
app.get('/logout', sessionController.signout)

app.post('/api/getUser', function (req, res) {
    (async () => {
        try {
            const loggedInUser = await ig.user.info(ig.state.cookieUserId);
            return res.send(loggedInUser)
        } catch (e) {
            console.log(e)
            return res.send(e)
        }
    })();
})
const port = process.env.PORT || 3330
app.listen(port, () => console.log(`IG API server started listening on ${port}...`))