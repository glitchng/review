const http = require('http');
const TelegramBot = require('node-telegram-bot-api');

// === CONFIGURATION ===
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHANNEL_ID = '-1002353520070'; // Replace with your channel ID
const ADMIN_ID = 6101660516;         // Replace with your Telegram ID

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

let broadcasting = false;
let broadcastInterval = null;
let messageCount = 0;

// === Good Reviews List ===
const reviews = [
  "🌟 This app is amazing! I’ve earned so much in just a week.",
  "💯 Legit and super easy to use. Highly recommend!",
  "🔥 Just got my first payment today. Thanks guys!",
  "👏 I’ve referred my friends and we’re all enjoying the rewards.",
  "✅ Everything works smoothly. Best app I’ve used this year.",
  "😎 Great support and instant withdrawals. Keep it up!",
  "💸 Earnings drop daily like clockwork. Love it!",
  "👌 Simple UI, fast payments, no stress.",
  "🙌 Got paid without any issues. Real deal!",
  "🤑 Was skeptical at first but it’s real. Highly recommended!"
];

// === Nigerian Name Generators ===
const firstNames = [
  "Chinedu", "Aisha", "Tunde", "Ngozi", "Emeka", "Fatima", "Ibrahim", "Kelechi",
  "Seyi", "Adaobi", "Bola", "Obinna", "Zainab", "Yusuf", "Amaka", "David", "Grace",
  "Uche", "Tope", "Nneka", "Samuel", "Maryam", "Gbenga", "Rashida", "Kingsley", "Temitope",
  "Hadiza", "John", "Blessing", "Peter", "Linda", "Ahmed", "Funmi", "Rita", "Abdul",
  "Chika", "Paul", "Victoria", "Halima", "Ifeanyi", "Sarah", "Joseph", "Joy", "Musa",
  "Bukky", "Stephen", "Aminat", "Henry", "Femi", "Micheal", "Modupe", "Yemisi", "Titi",
  "Chijioke", "Oluwaseun", "Durojaiye", "Fatimah", "Ademola", "Ifeoluwa", "Hassan", "Aderemi",
  "Idris", "Ekong", "Ivy", "Uko", "Eyo", "Abasiama", "Mfon", "Mbakara", "Nkechi",
  "Idorenyin", "Martha", "Ita", "Akpan", "Essien", "Obong", "Ikot", "Inyang", "Ntia",
  "Akpabio", "Etim", "Inyene", "Ndiana", "Udoh", "Akanimoh", "Udo", "Ukpong"
];

const lastNames = [
  "Okoro", "Bello", "Oladipo", "Nwankwo", "Eze", "Musa", "Lawal", "Umeh", "Bakare",
  "Okafor", "Adeyemi", "Mohammed", "Onyeka", "Ibrahim", "Ogunleye", "Balogun",
  "Chukwu", "Usman", "Abiola", "Okonkwo", "Aliyu", "Ogundele", "Danladi", "Ogbonna",
  "Salami", "Olumide", "Obi", "Akinwale", "Suleiman", "Ekwueme", "Ayodele", "Garba",
  "Nwachukwu", "Anyanwu", "Yahaya", "Idowu", "Ezra", "Mustapha", "Iroko", "Ajayi",
  "Adebayo", "Ogundipe", "Nuhu", "Bamgbose", "Ikenna", "Osagie", "Akinyemi", "Chisom",
  "Oladele", "Adeleke", "Fashola", "Taiwo", "Tiwatope", "Onyebuchi", "Ikechukwu",
  "Nnaji", "Ogunbiyi", "Sule", "Muhammad", "Alabi", "Oloyede", "Etim", "Bassey",
  "Otu", "Akpabio", "Ubong"
];

function getRandomNigerianName() {
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${first} ${last}`;
}

// === Message Sender ===
function sendReviewMessage() {
  const review = reviews[Math.floor(Math.random() * reviews.length)];
  const name = getRandomNigerianName();
  const message = `${review}\n—from *${name}*`;

  bot.sendMessage(CHANNEL_ID, message, { parse_mode: "Markdown" });
}

// === Broadcast Control ===
function startBroadcasting() {
  if (broadcasting) return;
  broadcasting = true;
  messageCount = 0;

  broadcastInterval = setInterval(() => {
    if (!broadcasting || messageCount >= 60) {  // Limit to 60 messages per minute
      stopBroadcasting();
      return;
    }

    sendReviewMessage();
    messageCount++;
  }, 1000); // 1 second interval for 60 messages in a minute
}

function stopBroadcasting() {
  broadcasting = false;
  if (broadcastInterval) {
    clearInterval(broadcastInterval);
    broadcastInterval = null;
  }
}

// === Bot Commands ===
bot.onText(/\/start/, (msg) => {
  if (msg.chat.id == ADMIN_ID) {
    bot.sendMessage(msg.chat.id, "✅ Review broadcasting started.");
    startBroadcasting();
  } else {
    bot.sendMessage(msg.chat.id, "❌ You are not authorized.");
  }
});

bot.onText(/\/stop/, (msg) => {
  if (msg.chat.id == ADMIN_ID) {
    bot.sendMessage(msg.chat.id, "🛑 Review broadcasting stopped.");
    stopBroadcasting();
  } else {
    bot.sendMessage(msg.chat.id, "❌ You are not authorized.");
  }
});

// Optional: start automatically
// startBroadcasting();

// === Dummy HTTP Server for Render ===
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Telegram bot is running.\n');
}).listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
