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
  "🌟 I’ve tried countless “earn money online” platforms, and honestly, most of them were either full of ads or made it nearly impossible to withdraw. Earnbuzz was different from day one. It was easy to understand, and within the first week, I had already earned enough to make my first withdrawal. What shocked me the most was how fast the payment came through — no delays, no runaround. I’ve now been using it for over three months, and the earnings have been consistent. It's not get-rich-quick, but it's real, and that’s what matters to me.",
  "💯 Before Earnbuzz, I was struggling to find a side hustle that didn’t take hours of my time. I work a full-time job, and with two kids, I don’t have much energy left at the end of the day. A friend introduced me to Earnbuzz, and I figured I had nothing to lose. Best decision I made this year. The platform is clean, easy to use, and doesn't waste your time. I earn daily without stress, and withdrawals are super fast. The extra money has helped me cover groceries, small bills, and even a birthday gift for my daughter. I’m truly grateful I found this when I did.",
  "🔥 At first, I didn’t believe the hype around Earnbuzz. I’ve seen too many platforms that promised the world but gave nothing. But after seeing several payment proofs and reading real user stories, I decided to try it. I started small and didn’t expect much, but I was pleasantly surprised. Within a couple of weeks, I saw steady earnings. I made my first withdrawal and it came through faster than expected. The best part? There’s real customer support. I reached out with a small issue once and got a response within hours. That’s rare these days. Earnbuzz has earned my trust.",
  "👏 I’ve been using Earnbuzz daily for almost a month now. It’s part of my morning routine — wake up, check earnings, complete tasks, and build up my balance. What I love most is the consistency. No tricks, no fake promises. I’ve withdrawn several times, and the process is seamless. It’s helped me slowly build up savings, especially during months where money was tight. And the referral system is a huge bonus. I invited a few friends, and we’ve all been benefiting together. It’s honestly one of the few platforms I can confidently recommend.",
  "✅ As someone who’s tried nearly every online side hustle — from dropshipping to surveys — Earnbuzz has been the only platform that gave me consistent results without overwhelming me. The dashboard is super user-friendly, even for someone who’s not tech-savvy. I started with zero expectations, but now it’s a key part of how I earn extra cash every week. I’ve withdrawn multiple times without a single hiccup, which says a lot. Plus, their support team is always available. It’s rare to find something that actually delivers like this.",
  "😎 When I first heard about Earnbuzz, I was skeptical. It sounded too good to be true, but I gave it a shot after seeing a friend post about his withdrawal. Fast forward two months, and I’m now the one sharing screenshots! I’ve earned more than I thought possible for the time I put in. The process is simple, the platform doesn’t crash or glitch, and payments arrive reliably. It’s helped me afford little things I used to stress over — like data top-ups, transport fare, and groceries. For anyone looking for legit side income, this is worth your time.",
  "💸 Earnbuzz came into my life at the perfect time. I had just lost a part-time job and needed a way to make ends meet. I was cautious, but the platform felt different — professional, straightforward, and actually functional. I gave it two weeks and was shocked when my first withdrawal came through instantly. Since then, I’ve been consistently earning and withdrawing every week. It’s not going to replace a full-time job, but for what it is, it works — and that peace of mind is priceless. I’m thankful for platforms like this that actually help people.",
  "👌 One of the things I appreciate most about Earnbuzz is how transparent everything is. From the moment you sign up, you can clearly see how things work, how much you earn, and when you can withdraw. No shady rules or sudden changes. I’ve used it for nearly 5 months now, and it’s helped me earn a reliable side income without eating up my time. I’ve even started saving up to buy a small gadget I’ve wanted for a while — something I couldn’t do before. If you’re looking for something consistent and honest, this is it.",
  "🙌 I’m not the type to write reviews, but Earnbuzz honestly deserves it. I’ve been burned by too many fake platforms in the past, so when I found something that actually pays, I had to speak up. It’s helped me earn on the side without investing anything upfront. The user interface is super smooth, and I’ve never had a delay with withdrawals. I even reached out to support once, and they were polite and quick to resolve my issue. That says a lot. This platform has genuinely helped me out.",
  "🤑 I started using Earnbuzz just to test it out, but now it’s a regular part of my income. I don’t have to do anything complicated — just log in, do a few things, and I get rewarded. What makes it stand out is the consistency. It doesn’t suddenly stop working or make you jump through hoops to get your money. I’ve referred a few friends too, and they’re all seeing results. Whether you’re a student, a parent, or just someone trying to make ends meet, I think Earnbuzz is genuinely worth your time."
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
    if (!broadcasting || messageCount >= 5) {  // Limit to 5 messages per minute
      stopBroadcasting();
      return;
    }

    sendReviewMessage();
    messageCount++;
  }, 12000); // 12 seconds interval for 5 messages per minute
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
