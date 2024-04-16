
// =========== Ngrok webserver code =========== //

const http = require('http');
const ngrok = require('@ngrok/ngrok');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const ngrokAuthToken = config.ngrokAuthToken;

// Create webserver on port 4000
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('Congrats you have created an ngrok web server');
}).listen(4000, () => console.log('Node.js web server at 4000 is running...'));

// Get your endpoint online
ngrok.authtoken(ngrokAuthToken);
ngrok.connect({ addr: 3000 })
  .then(listener => {
    console.log(`Ingress established at: ${listener.url()}`);
    setInterval(() => {
      sendToDiscord(`View what/where the bot doing/is at: ${listener.url()} 🌐`);
    }, 30 * 1000);
  })
  .catch(error => console.error('Error starting ngrok:', error));

// ============ Mineflayer bot code ============== //

const mineflayer = require("mineflayer");
const { Client, GatewayIntentBits, ActivityType } = require("discord.js");
const mineflayerViewer = require('prismarine-viewer').mineflayer
const { pathfinder, Movements } = require('mineflayer-pathfinder')
const { GoalBlock } = require('mineflayer-pathfinder').goals

let bot;
let discordClient;
let isAntiAfkActive = false;
let antiAfkInterval;

function createBot() {
  const botUsername1 = config.botUsername;
  const serverHost1 = config.serverHost;
  const serverPort1 = config.serverPort;
  const version1 = config.serverVersion;
  const auth = config.botAuth;
  const ign = config.ign;
  const password = config.botPass;
  bot = mineflayer.createBot({
    host: serverHost1,
    port: serverPort1,
    username: botUsername1,
    version: version1,
    auth: auth,
    ign: ign,
    password: password,
   // keepalive: 60 * 1000,
    autoReconnect: true,
    reconnectTimer: 5 * 1000,
  });

  bot.loadPlugin(pathfinder);

  bot.once("spawn", () => {
    sendToDiscord("Bot spawned 🙌");
    mineflayerViewer(bot, { port: 3000 });
    const mcData = require('minecraft-data')(bot.version)
    const defaultMove = new Movements(bot, mcData)
  bot.on('path_update', (r) => {
    const nodesPerTick = (r.visitedNodes * 50 / r.time).toFixed(2)
   // console.log(`I can get there in ${r.path.length} moves. Computation took ${r.time.toFixed(2)} ms (${nodesPerTick} nodes/tick). ${r.status}`)
    const path = [bot.entity.position.offset(0, 0.5, 0)]
    for (const node of r.path) {
      path.push({ x: node.x, y: node.y + 0.5, z: node.z })
    }
    bot.viewer.drawLine('path', path, 0xff00ff)
  })

  bot.viewer.on('blockClicked', (block, face, button) => {
    if (button !== 2) return // only right click

    const p = block.position.offset(0, 1, 0)

    bot.pathfinder.setMovements(defaultMove)
    bot.pathfinder.setGoal(new GoalBlock(p.x, p.y, p.z))
  })
//   x = setInterval(() => {
//     sendToMinecraft("/Rclickslot 4");
//     setTimeout(() => {
//         sendToMinecraft("/Lclickslot 12");  <- example for how to automate intial navigation pattern to enter sub-server
//     }, 1500);
//   }, 3 * 1000);

//   setTimeout(function() {
//     clearInterval(x);
//     //console.log("10 seconds have passed, interval stopped.");
//   }, 6 * 1000);
  });

  bot.on("windowOpen", () => {
    //bot.simpleClick.leftMouse(12);
    sendToDiscord(`Window opened 🔓`);
  });

  bot.on("windowClose", () => {
    sendToDiscord(`Window closed 🔐`);
  });

  bot.on("login", () => {
    sendToDiscord("Bot logged in 🙌");
    //bot.chat(`/register ${config.botPswd} ${config.botPswd}`);
    bot.chat(`/login ${config.botPswd}`);
   // let x;
//   x = setInterval(() => {
//     sendToMinecraft("/Rclickslot 4");
//     setTimeout(() => {
//         sendToMinecraft("/Lclickslot 12");  <- example for how to automate intial navigation pattern to enter sub-server
//     }, 1500);
//   }, 3 * 1000);

//   setTimeout(function() {
//     clearInterval(x);
//     console.log("10 seconds have passed, interval stopped.");
//   }, 6 * 1000);
      setInterval(() => {
            const playerList = Object.keys(bot.players).join(', ');
            const totalPlayers = Object.keys(bot.players).length;
            sendToDiscord(`Players 👥 in tab list (${totalPlayers}): ${playerList}`); 
        }, 5 * 60 * 1000);  // <-- customize it to your need, sends this every 5 minutes, for 2.5min 2.5 * 60 * 1000 ie minutes * seconds * 1000
    setTimeout(() => {
      bot.setControlState("forward", true);
      setTimeout(() => {
        bot.setControlState("forward", false);
      }, 5000);
    }, 1000);
    // sendToMinecraft("/Rclickslot 4");
    // setTimeout(() => {
    //     sendToMinecraft("/Lclickslot 12");  <- example for how to automate intial navigation pattern to enter sub-server
    // }, 3000);
  });

bot.on("death", () => {
    sendToDiscord("The bot has died. 💀 Respawning...");
    if (!bot.spawn) {
      setTimeout(() => {
        bot.respawn();
      }, 5000); // Wait 5 seconds before respawning
    } else {
      console.log("Bot 🤖 is already respawned, skipping respawn attempt.");
    }
  });	
	
  const players = {};
  // chatpattern/regex fucker, avoids unnessary trouble.

  bot.on("playerJoined", (player) => {
    players[player.uuid] = player.username;
  });

  bot.on("playerLeft", (player) => {
    delete players[player.uuid];
  });

  bot.on('message', (username, message, sender) => {     // I know this looks weird, it worked so I did not touch it, customize this if it dosent work for you
    if (typeof message === 'string') {
      const usernameStr = String(username);
  
      if (config.BlockedMessages.some(blockedMessage => usernameStr.includes(blockedMessage)) || usernameStr.length === 0) {
          return;
        }
  
      if (sender === null) {
        sendToDiscord(`[Server] 🗣️ ${usernameStr}`);
      } else {
        const playerName = players[sender] || "Unknown";
        sendToDiscord(`💬 ${playerName} » ${usernameStr}`);
      }} else {
      console.log("Received a non-string message:", message);
          }
      });

  bot.on("error", (err) => {
    sendToDiscord("Bot encountered an error: 😞", err);
  });

  bot.on("end", () => {
    sendToDiscord("Disconnected from the server, attempting to reconnect... 🔄");
    bot.viewer.close();
    createBot();
  });
}

function sendToMinecraft(message, discordUsername) {
    if (message === "/antiafk") {
        if (isAntiAfkActive) {
          stopAntiAfkInterval();
          sendToDiscord("Anti-AFK mode deactivated. 🛑");
        } else {
          startAntiAfkInterval();
          sendToDiscord("Anti-AFK mode activated. 🚀");
        }
      } else if (message === "/listtab") {
    const playerList = Object.keys(bot.players).join(", ");
    const totalPlayers = Object.keys(bot.players).length;
    sendToDiscord(`Players 👥 in tab list (${totalPlayers}): ${playerList}`);
  } else if (message === "/reconnect") {
    bot.end();
  } else if (message.startsWith("/Rclickslot")) {
    const slotNumber = parseInt(message.split(" ")[1]);
    if (!isNaN(slotNumber)) {
        if (slotNumber > 8) {
          sendToDiscord("There are only 9(0 to 8) slots in the hotbar! 🤔");
        } else {
          bot.setQuickBarSlot(slotNumber);
          bot.activateItem();
        }
      }
  } else if (message.startsWith("/Lclickslot")) {
    const slotNumber = parseInt(message.split(" ")[1]);
    if (!isNaN(slotNumber)) {
      bot.simpleClick.leftMouse(slotNumber, 0, 0);
    }
  } else if (message === "/closewindow") {
    bot.closeWindow(bot.currentWindow);
  } else {
    bot.chat(`${message}`);
     // bot.chat(`${discordUsername} » ${message}`);  // <-- uncomment and comment the upper line if you want the bot to send messages with dc username
  }
}

function startAntiAfkInterval() {
    isAntiAfkActive = true;
    antiAfkInterval = setInterval(() => {
      const randomX = Math.floor(Math.random() * 10) + 1;
			const randomZ = Math.floor(Math.random() * 10) + 1;

			bot.setControlState('forward', true);
			bot.setControlState('sprint', true);
			bot.setControlState('jump', true);
			bot.setControlState('right', Math.random() > 0.5);
			bot.setControlState('left', Math.random() > 0.5);

			bot.look(Math.random() * 180 - 90, 0, true);

			setTimeout(() => {
				bot.setControlState('forward', false);
				bot.setControlState('sprint', false);
				bot.setControlState('jump', false);
				bot.setControlState('right', false);
				bot.setControlState('left', false);
			}, 500);

			bot.setControlState('back', true);

			setTimeout(() => {
				bot.setControlState('back', false);
			}, 500);

			bot.setControlState('right', true);

			setTimeout(() => {
				bot.setControlState('right', false);
			}, 500);
      
			bot.setControlState('left', true);

			setTimeout(() => {
				bot.setControlState('left', false);
			}, 500);

			bot.setControlState('jump', true);

			setTimeout(() => {
				bot.setControlState('jump', false);
			}, 500);

			bot.setControlState('sprint', true);

			setTimeout(() => {
				bot.setControlState('sprint', false);
			}, 500);

			bot.look(Math.random() * 180 - 90, 0, true);

			bot.setControlState('forward', true);

			setTimeout(() => {
				bot.setControlState('forward', false);
			}, 500);
    }, 30 * 1000); // <-- antiafk initiate interval 30 seconds, customize it to your needed seconds by replacing 30 with your interval
  }
  
  function stopAntiAfkInterval() {
    isAntiAfkActive = false;
    clearInterval(antiAfkInterval);
  }

function sendToDiscord(message) {
  if (discordClient) {
    const channel = discordClient.channels.cache.get(config.discordChannelId);
    if (channel && channel.send) {
      message = "```fix\n " + message + "\n```";
      channel.send(message);
    }
  }
}

createBot();

// ============== Discord code =============== //

discordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
});

discordClient.login(config.discordToken);

discordClient.on("ready", () => {
  console.log("Discord bot connected");
  discordClient.user.setActivity(`${config.serverHost}`, {
    type: ActivityType.Playing,
  });
});

discordClient.on("messageCreate", (message) => {
  if (
    message.channel.id === config.discordChannelId &&
    config.allowedUserIds.includes(message.author.id)
  ) {
    sendToMinecraft(message.content, message.author.username);
  }
});
