import express from "express";
import BotService from "./services/bot.service";

const app = express();
const port = 8080 || process.env.PORT;
const bot = new BotService();
// app.get("/", (req, res) => {
//   res.send("Hi!");
// });

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  bot.login();
  console.log(`server started at http://localhost:${port}`);
});