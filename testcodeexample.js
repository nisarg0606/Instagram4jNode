// app.post('/api/login', (req, res) => {
//     username : req.body.username;
//     password : req.body.password;
//     console.log(username);
//     console.log(password);
//     (async () => {
//         ig.state.generateDevice(process.env.IG_USERNAME);
//         let shouldLogin = true;
//         try {
//             if (await instaSessionExists()) {
//                 shouldLogin = false;
//                 console.log('Insta Session Exists');
//                 let loaded_session = await instaSessionLoad()
//                 console.log('loaded_session: ' + loaded_session);
//                 await ig.state.deserialize(loaded_session);
//                 let userinfo = await ig.user.info(ig.state.cookieUserId);
//                 console.log('Insta Session Deserialized');
//                 return res.send(userinfo)
//             } else {
//                 console.log('Insta Session Does Not Exist');
//             }
//         } catch (e) {
//             console.log(e)
//             return res.send(e)
//         }

//         if (shouldLogin) {
//             console.log('----- !!! IG Account Login Procedure !!! ----- ')

//             await ig.simulate.preLoginFlow();

//             ig.request.end$.subscribe(async () => {
//                 const serialized = await ig.state.serialize();
//                 delete serialized.constants; // this deletes the version info, so you'll always use the version provided by the library
//                 instaSessionSave(serialized);
//             });

//             const loggedInUser = await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
//             return res.send(loggedInUser)
//         }
//     })();
// })

// app.get('/api/logout', function (req, res) {
//     (async () => {
//         try {
//             if (await instaSessionExists()) {
//                 await instaSessionDelete();
//                 return res.send('Session Deleted')
//             } else {
//                 return res.send('Session Does Not Exist')
//             }
//         } catch (e) {
//             console.log(e)
//             return res.send(e)
//         }
//     })();
// })