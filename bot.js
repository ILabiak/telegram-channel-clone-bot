"use strict";

require("dotenv").config();
const fs = require("fs");
const Telegraf = require("telegraf");
const Extra = require("telegraf/extra");
const Markup = require("telegraf/markup");
const session = require("telegraf/session");

const start = 62;
const end = 634;

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply("start"));

bot.use(session());
bot.catch((err) => {
  console.log(err);
});

bot.command("forward", async (ctx) => {
  ctx.reply("started copying");
  for (let i = start; i <= end; i++) {
    // console.log(i);
    try {
      let id = await ctx.telegram.copyMessage(
        process.env.DESTINATION,
        process.env.SOURCE,
        i
      );
      console.log(id);
      fs.appendFileSync(
        "./log.txt",
        `Message ${i} copied successfully, message id: ${id?.message_id}\n`
      );
    } catch (err) {
      console.log(err);
      fs.appendFileSync(
        "./log.txt",
        `Error while copying message with id ${i}, ${err.message}\n`
      );
    }
    //Also note that your bot will not be able to send more than 20 messages per minute to the same group.
    await new Promise((resolve) => setTimeout(resolve, 3300));
  }
  ctx.reply("ended copying");
});

bot.launch();

process.on("uncaughtException", function (err) {
  console.log("Caught exception: ", err);
});
