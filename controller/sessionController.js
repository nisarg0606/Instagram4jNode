const { writeFile, readFile, access, link, unlink } = require('fs/promises');
const { IgApiClient } = require('instagram-private-api');
const { model } = require('mongoose')
const UserModel = require('../model/UserModel')

const ig = new IgApiClient();
var loggedInUser;


async function instaSessionSave(data) {
    console.log("Trying to save the IG Session");
    try {
        await writeFile('login-data.json', JSON.stringify(data));
        console.log('Saved IG Session');
    } catch (err) {
        console.error(err);
    }
    return data;
}

async function instaSessionExists() {
    try {
        await access(path.join(__dirname, "login-data.json"));
        return true
    } catch (err) {
        return false;
    }
}

async function instaSessionLoad() {
    console.log("Trying to load the IG Session");
    try {
        let data = await readFile('login-data.json');
        console.log('Loaded the IG Session');
        return JSON.parse(data);
    } catch (err) {
        console.error(err);
        return false
    }
}

async function instaSessionDelete() {
    console.log("Trying to delete the IG Session");
    try {
        const response = await ig.account.logout();
        console.log(response);
        await unlink('login-data.json', function (err) {
            if (err) throw err;
            console.log('File deleted!');
        });
        console.log('Deleted the IG Session');
        return true
    } catch (err) {
        console.error(err);
        return false
    }
}

module.exports.signin = async (req, res) => {
    let user = new UserModel({
        username: req.body.username,
        password: req.body.password
    });
    (async () => {
        ig.state.generateDevice(user.username);
        let shouldLogin = true;
        try {
            if (await instaSessionExists()) {
                shouldLogin = false;
                console.log('Insta Session Exists');
                let loaded_session = await instaSessionLoad()
                console.log('loaded_session: ' + loaded_session);
                await ig.state.deserialize(loaded_session);
                let userinfo = await ig.user.info(ig.state.cookieUserId);
                console.log('Insta Session Deserialized');
                return res.send(userinfo)
            } else {
                console.log('Insta Session Does Not Exist');
            }
        } catch (e) {
            console.log(e)
            return res.send(e)
        }

        if (shouldLogin) {
            console.log('----- !!! IG Account Login Procedure !!! ----- ')
            await ig.simulate.preLoginFlow();
            ig.request.end$.subscribe(async () => {
                const serialized = await ig.state.serialize();
                delete serialized.constants; // this deletes the version info, so you'll always use the version provided by the library
                instaSessionSave(serialized);
            });
            loggedInUser = await ig.account.login(user.username, user.password);
            console.log('----- !!! IG Account Login Procedure Completed !!! ----- ')
            return res.send(loggedInUser)
        }
    })();
}

module.exports.signout = async (req, res) => {
    try {
        if (instaSessionExists()) {
            await instaSessionDelete();
            console.log('Insta Session Deleted');
            return res.send('Insta Session Deleted')
        } else {
            return res.send('Insta Session Does Not Exist')
        }
    } catch (e) {
        console.log(e)
        return res.send(e)
    }
}
