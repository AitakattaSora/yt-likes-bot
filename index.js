const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const getYouTubeID = require('get-youtube-id');
const abbreviate = require('number-abbreviate');
require('dotenv').config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const admins = process.env.ADMINS.split(',');

const bot = new TelegramBot(token, { polling: true });

bot.onText(/https?(.+)/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    if (!admins.includes(msg.from.id.toString())) return;
    const id = getYouTubeID(msg.text);

    const response = await axios.get(
      `https://returnyoutubedislikeapi.com/votes?videoId=${id}`
    );
    const { likes, dislikes } = response.data;

    bot.sendMessage(
      chatId,
      `<strong>${abbreviate(likes)}</strong> likes, <strong>${abbreviate(
        dislikes
      )}</strong> dislikes`,
      { parse_mode: 'HTML' }
    );
  } catch (err) {
    bot.sendMessage(msg.chat.id, 'error occured');
    throw err;
  }
});
