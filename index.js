//
// Made by :-
//
//            $$$$$$$\            $$\   $$\                     $$\           
//            $$  __$$\           $$ |  $$ |                    $$ |          
//            $$ |  $$ | $$$$$$\  $$ |  $$ | $$$$$$$\ $$\   $$\ $$ | $$$$$$\  
//            $$ |  $$ |$$  __$$\ $$$$$$$$ |$$  _____|$$ |  $$ |$$ |$$  __$$\ 
//            $$ |  $$ |$$ |  \__|\_____$$ |$$ /      $$ |  $$ |$$ |$$$$$$$$ |
//            $$ |  $$ |$$ |            $$ |$$ |      $$ |  $$ |$$ |$$   ____|
//            $$$$$$$  |$$ |            $$ |\$$$$$$$\ \$$$$$$  |$$ |\$$$$$$$\ 
//            \_______/ \__|            \__| \_______| \______/ \__| \_______|
//                                                            
//         Minecraft-Mineflayer-Discord-Chatbridge-Bot                                                     
//                                                                

console.log(`





\x1b[1m \x1b[35m

   Made by :-

$$$$$$$\\            $$\\   $$\\                     $$\\           
$$  __$$\\           $$ |  $$ |                    $$ |          
$$ |  $$ | $$$$$$\\  $$ |  $$ | $$$$$$$\\ $$\\   $$\\ $$ | $$$$$$\\  
$$ |  $$ |$$  __$$\\ $$$$$$$$ |$$  _____|$$ |  $$ |$$ |$$  __$$\\ 
$$ |  $$ |$$ |  \\__|\\_____$$ |$$ /      $$ |  $$ |$$ |$$$$$$$$ |
$$ |  $$ |$$ |            $$ |$$ |      $$ |  $$ |$$ |$$   ____|
$$$$$$$  |$$ |            $$ |\\$$$$$$$\\ \\$$$$$$  |$$ |\\$$$$$$$\ 
\\_______/ \\__|            \\__| \\_______| \\______/ \\__| \\_______|

        Welcome to Minecraft-Mineflayer-Discord-bridge 🤖🌍    \x1b[0m
`)

const http = require('http');
const ngrok = require('@ngrok/ngrok');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const ngrokAuthToken = config.ngrokAuthToken;
const readline = require('readline');

// ============ Mineflayer bot code ============== //

const mineflayer = require("mineflayer");
const {
	Client,
	GatewayIntentBits,
	ActivityType
} = require("discord.js");
const mineflayerViewer = require('prismarine-viewer').mineflayer
const {
	pathfinder,
	Movements
} = require('mineflayer-pathfinder')
const {
	GoalBlock
} = require('mineflayer-pathfinder').goals
const autoeat = require('mineflayer-auto-eat').plugin
const armorManager = require("mineflayer-armor-manager");

let bot;
let discordClient;
let isAntiAfkActive = false;
let antiAfkInterval;
let discord = config.Preference;

async function createBot() {
	bot = mineflayer.createBot({
		host: config.serverHost,
		port: config.serverPort,
		username: config.botUsername,
		version: config.serverVersion,
		auth: config.botAuth,
		ign: config.ign,
		password: config.botPass,
		autoReconnect: true,
		reconnectTimer: 5 * 1000,
		viewDistance: "normal"
	});

	bot.loadPlugin(pathfinder);
	bot.loadPlugin(autoeat);
	bot.loadPlugin(armorManager);

	bot.once("spawn", () => {
		if (discord) {
			sendToDiscord(`Bot spawned 🙌`);
		} else {
			console.log("\x1b[1m \x1b[35m Bot spawned 🙌\x1b[0m");
		}
		mineflayerViewer(bot, {
			port: 3000
		});
		console.log("\x1b[1m \x1b[35m Bot viewer started on http://localhost:3000/ 🌐\x1b[0m");
		bot.armorManager.equipAll();
		const mcData = require('minecraft-data')(bot.version)
		const defaultMove = new Movements(bot, mcData)
		bot.on('path_update', (r) => {
			const nodesPerTick = (r.visitedNodes * 50 / r.time).toFixed(2)
			//console.log(`I can get there in ${r.path.length} moves. Computation took ${r.time.toFixed(2)} ms (${nodesPerTick} nodes/tick). ${r.status}`)
			const path = [bot.entity.position.offset(0, 0.5, 0)]
			for (const node of r.path) {
				path.push({
					x: node.x,
					y: node.y + 0.5,
					z: node.z
				})
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
		if (discord) {
			sendToDiscord(`Window opened 🔓`);
		} else {
			console.log(`\x1b[1m \x1b[35m Window opened 🔓\x1b[0m`);
		}
	});

	bot.on("windowClose", () => {
		if (discord) {
			sendToDiscord(`Window closed 🔐`);
		} else {
			console.log(`\x1b[1m \x1b[35m Window closed 🔐\x1b[0m`);
		}
	});

	// bot.on('autoeat_finished', (item, offhand) => {
	// 	sendToDiscord(`😋 Ate ${item.name} from ${offhand ? 'offhand' : 'hand'}`)
	// })

	bot.once("login", () => {
		if (discord) {
			sendToDiscord(`Bot logged in 🙌`);
		} else {
			console.log(`\x1b[1m \x1b[35m Bot logged in 🙌\x1b[0m`);
		}
		bot.chat(`/register ${config.botPswd} ${config.botPswd}`);
		setTimeout(() => bot.chat(`/login ${config.botPswd}`), 3000);
		if (discord) {
			setInterval(() => sendPlayerListToDiscord(), 5 * 60 * 1000); // <-- customize it to your need, sends this every 5 minutes
		} else {
			setInterval(() => {
				const playerList = Object.keys(bot.players).join(', ');
				const totalPlayers = Object.keys(bot.players).length;
				console.log(`\x1b[1m \x1b[35m Players in tab list (${totalPlayers}): ${playerList}\x1b[0m`);
			}, 5 * 60 * 1000);
		}
		setTimeout(() => {
			bot.setControlState("forward", true);
			setTimeout(() => bot.setControlState("forward", false), 5000);
		}, 1000);
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
		// sendToMinecraft("/Rclickslot 4");
		// setTimeout(() => {
		//     sendToMinecraft("/Lclickslot 12");  <- example for how to automate intial navigation pattern to enter sub-server
		// }, 3000);
	});

	bot.on("death", async () => {
		if (discord) {
			sendToDiscord("The bot has died. 💀 Respawning...");
		} else {
			console.log("\x1b[1m \x1b[35m The bot has died. 💀 Respawning...\x1b[0m");
		}
		if (!bot.spawn) {
			await sleep(5000); // Wait 5 seconds before respawning
			bot.respawn();
		} else {
			if (discord) {
				sendToDiscord("Bot 🤖 is already respawned, skipping respawn attempt.");
			} else {
				console.log("\x1b[1m \x1b[35m Bot 🤖 is already respawned, skipping respawn attempt.\x1b[0m");
			}
		}
	});

	const players = {};

	bot.on("playerJoined", (player) => {
		players[player.uuid] = player.username;
	});
	bot.on("playerLeft", (player) => {
		delete players[player.uuid];
	});

	bot.on('message', (username, message, sender) => {
		if (typeof message === 'string') {
			const usernameStr = username;
			if (config.BlockedMessages.some(blockedMessage => String(usernameStr).includes(blockedMessage)) || usernameStr.length === 0) return;

			const playerName = sender ? (players[sender] || "") : (discord ? "[Server]" : "\x1b[1m \x1b[35m [Server]\x1b[0m");
			if (discord) {
				sendToDiscord(`💬 ${playerName} » ${usernameStr}`);
			} else {
				console.log(`💬 \x1b[1m\x1b[97m${playerName}\x1b[0m » ${usernameStr.toAnsi()}`);
			}
		} else {
			console.log("Received a non-string message:", message);
		}
	});

	bot.on("error", (err) => {
		if (discord) {
			sendToDiscord("Bot encountered an error: 😞", err);
		} else {
			console.log("\x1b[1m \x1b[35m Bot encountered an error: 😞\x1b[0m", err);
		}
	});

	bot.on('kicked', (reason, loggedIn) => {
		if (discord){
			sendToDiscord(`Bot was kicked from the server: 😞", ${reason}, Logged in: ${loggedIn}`);
		} else {
			console.log(`\x1b[1m \x1b[35m Bot was kicked from the server: 😞", ${reason}, Logged in: ${loggedIn} \x1b[0m`);
		}
	});
	
	bot.on("end", () => {
		if (discord) {
			sendToDiscord("Bot disconnected from the server, attempting to reconnect... 🔄");
		} else {
			console.log("\x1b[1m \x1b[35m Bot disconnected from the server, attempting to reconnect... 🔄\x1b[0m");
		}
		if (bot.viewer) bot.viewer.close();
		createBot();
	});
}

async function sendToMinecraft(message, discordUsername) {
	if (message === "/antiafk") {
		isAntiAfkActive ? stopAntiAfkInterval() : startAntiAfkInterval();
		sendToDiscord(isAntiAfkActive ? "Anti-AFK mode activated. 🚀" : "Anti-AFK mode deactivated. 🛑");
	} else if (message === "/listtab") {
		sendPlayerListToDiscord();
	} else if (message === "/reconnect") {
		bot.end();
	} else if (message.startsWith("/Rclickslot")) {
		const slotNumber = parseInt(message.split(" ")[1]);
		if (!isNaN(slotNumber) && slotNumber <= 8) {
			bot.setQuickBarSlot(slotNumber);
			bot.activateItem();
		} else {
			sendToDiscord("There are only 9(0 to 8) slots in the hotbar! 🤔");
		}
	} else if (message.startsWith("/Lclickslot")) {
		const slotNumber = parseInt(message.split(" ")[1]);
		if (!isNaN(slotNumber)) {
			if (slotNumber > 53) {
				sendToDiscord("Slot number exceeds the maximum number of slots (53). 🤔");
			} else {
				bot.simpleClick.leftMouse(slotNumber, 0, 0);
			}
		}
	} else if (message === "/closewindow") {
		if (bot.currentWindow) {
			bot.closeWindow(bot.currentWindow);
		} else {
			sendToDiscord("No windows are currently open. 📭");
		}
	} else if (message === "/health") {
		const health = bot.health;
		const healthValue = (health / 2).toFixed(1);
		sendToDiscord(`Bot health: ${healthValue} ❤️`);
	} else if (message === "/coords") {
		const {
			x,
			y,
			z
		} = bot.entity.position;
		sendToDiscord(`Bot coordinates 🌐 : (${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)})`);
	} else if (message === "/inv") {
		const inventory = bot.inventory.items().filter(item => item !== null).map((item, index) => {
			return `${item.name} x${item.count} (Slot ${index})`;
		}).join(', ');
		sendToDiscord(`Bot inventory 👀 : ${inventory}`);
	} else if (message.startsWith("/yell ")) {
		const yellMessage = message.slice(6);
		bot.chat(`${discordUsername} 🗣️ ${yellMessage}`);
	} else if (message === "/move") {
		sendToDiscord('Bot moving 🏃‍♂️');
		bot.setControlState('forward', true);
		await sleep(5000);
		bot.setControlState('forward', false);
	} else if (message === "/hunger") {
		const hunger = (bot.food / 2).toFixed(1);
		sendToDiscord(`Bot hunger: ${hunger} 🍖`);
	} else if (message === "/tocmd") {
		sendToDiscord("Console mode activated, go to console. 🎉");
		discord = false;
		if (discordClient) {
			discordClient.destroy();
			console.log("\x1b[1m \x1b[35m Discord client closed. 🤖\x1b[0m");
		}
		console.log("\x1b[1m \x1b[35m Console mode activated. 🎉\x1b[0m");
	} else if (message === "/cmdhelp") {
		sendToDiscord(`Availabale commands: /antiafk, /listtab, /reconnect, /Rclickslot, /Lclickslot, /closewindow, /health, /coords, /inv, /yell, /move, /hunger, /tocmd`);
	} else {
		bot.chat(message);
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
		setTimeout(() => bot.setControlState('back', false), 500);
		bot.setControlState('right', true);
		setTimeout(() => bot.setControlState('right', false), 500);
		bot.setControlState('left', true);
		setTimeout(() => bot.setControlState('left', false), 500);
		bot.setControlState('jump', true);
		setTimeout(() => bot.setControlState('jump', false), 500);
		bot.setControlState('sprint', true);
		setTimeout(() => bot.setControlState('sprint', false), 500);

		bot.look(Math.random() * 180 - 90, 0, true);
		bot.setControlState('forward', true);
		setTimeout(() => bot.setControlState('forward', false), 500);
	}, 30 * 1000); // <-- antiafk initiate interval 30 seconds, customize it to your needed seconds by replacing 30 with your interval
}

function sendPlayerListToDiscord() {
	const playerList = Object.keys(bot.players).join(', ');
	const totalPlayers = Object.keys(bot.players).length;

	let playerListFormatted = '';
	const columns = 5;

	const playerArray = playerList.split(', ');
	for (let i = 0; i < playerArray.length; i += columns) {
		const rowPlayers = playerArray.slice(i, i + columns).join(', ');
		playerListFormatted += `${rowPlayers}${i + columns < playerArray.length ? ',' : ''}\n`;
	}

	const embedData = {
		type: 'rich',
		title: `${totalPlayers} players online`,
		description: `\`\`\`\n${playerListFormatted}\n\`\`\``,
		color: 0x00FFFF,
		fields: [{
			name: `${config.serverHost}`,
			value: '\u200B'
		}]
	};

	sendToDiscord(null, embedData);
}

function stopAntiAfkInterval() {
	isAntiAfkActive = false;
	clearInterval(antiAfkInterval);
}

function sendToDiscord(message, embedData = null) {
	if (discord) {
		if (discordClient) {
			const channel = discordClient.channels.cache.get(config.discordChannelId);
			if (channel && channel.send) {
				if (embedData) {
					channel.send({
						embeds: [embedData]
					});
				} else if (message) {
					channel.send(`\`\`\`fix\n${message}\n\`\`\``);
				}
			}
		} else {
			console.log("\x1b[1m \x1b[35m Could not relay the message to discord\x1b[0m");
		}
	}
}

// =========== Ngrok webserver code =========== //

if (discord){
	// Create webserver on port 4000
	const server = http.createServer((req, res) => {
		res.writeHead(200, {
			'Content-Type': 'text/html'
		});
		res.end('Congrats you have created an ngrok web server');
	});
	
	server.listen(4000, () => console.log('\x1b[1m \x1b[35m Node.js web server at 4000 is running...\x1b[0m'));
	
	// Get your endpoint online
	async function startNgrok() {
		try {
			await ngrok.authtoken(ngrokAuthToken);
			const listener = await ngrok.connect({
				addr: 3000
			});
			console.log(`Ingress established at: ${listener.url()}`);
			setInterval(() => {
				if (discord) {
					sendToDiscord(`View what/where the bot doing/is at: ${listener.url()} 🌐`);
				} else {
					console.log(`\x1b[1m \x1b[35m View what/where the bot doing/is at: ${listener.url()} 🌐\x1b[0m`);
				}
			}, 30 * 1000);
		} catch (error) {
			console.error('Error starting ngrok:', error);
		}
	}
	
	startNgrok();
	}

async function main() {
	await createBot();
	if (discord){
	discordClient = new Client({
		intents: Object.values(GatewayIntentBits)
	});
	await discordClient.login(config.discordToken);
	console.log("Discord bot connected");
	discordClient.user.setActivity(`${config.serverHost}`, {
		type: ActivityType.Playing
	});

	discordClient.on("messageCreate", (message) => {
		if (discord){
		if (message.channel.id === config.discordChannelId && config.allowedUserIds.includes(message.author.id)) {
			sendToMinecraft(message.content, message.author.username);
			message.react("✅");
		}
	  }
	});
  }
}

main();

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

rl.on('line', (input) => {
	if (!discord) {
		if (input === "/antiafk") {
			isAntiAfkActive ? stopAntiAfkInterval() : startAntiAfkInterval();
			console.log(isAntiAfkActive ? "\x1b[1m \x1b[35m Anti-AFK mode activated. 🚀\x1b[0m" : "\x1b[1m \x1b[35m Anti-AFK mode deactivated. 🛑\x1b[0m");
		} else if (input === "/listtab") {
			const playerList = Object.keys(bot.players).join(', ');
			const totalPlayers = Object.keys(bot.players).length;
			console.log(`\x1b[1m \x1b[35m Players in tab list (${totalPlayers}): ${playerList}\x1b[0m`);
		} else if (input === "/reconnect") {
			bot.end();
		} else if (input.startsWith("/Rclickslot")) {
			const slotNumber = parseInt(input.split(" ")[1]);
			if (!isNaN(slotNumber) && slotNumber <= 8) {
				bot.setQuickBarSlot(slotNumber);
				bot.activateItem();
			} else {
				console.log("\x1b[1m \x1b[35m There are only 9(0 to 8) slots in the hotbar! 🤔\x1b[0m");
			}
		} else if (input.startsWith("/Lclickslot")) {
			const slotNumber = parseInt(input.split(" ")[1]);
			if (!isNaN(slotNumber)) {
				if (slotNumber > 53) {
					console.log("\x1b[1m \x1b[35m Slot number exceeds the maximum number of slots (53). 🤔\x1b[0m");
				} else {
					bot.simpleClick.leftMouse(slotNumber, 0, 0);
				}
			}
		} else if (input === "/closewindow") {
			if (bot.currentWindow) {
				bot.closeWindow(bot.currentWindow);
			} else {
				console.log("\x1b[1m \x1b[35m No windows are currently open. 📭\x1b[0m");
			}
		} else if (input === "/health") {
			const health = bot.health;
			const healthValue = (health / 2).toFixed(1);
			console.log(`\x1b[1m \x1b[35m Bot health: ${healthValue} ❤️\x1b[0m`);
		} else if (input === "/coords") {
			const {
				x,
				y,
				z
			} = bot.entity.position;
			console.log(`\x1b[1m \x1b[35mBot coordinates 🌐 : (${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)})\x1b[0m`);
		} else if (input === "/inv") {
			const inventory = bot.inventory.items().filter(item => item !== null).map((item, index) => {
				return `${item.name} x${item.count} (Slot ${index})`;
			}).join(', ');
			console.log(`\x1b[1m \x1b[35m Bot inventory 👀 : ${inventory}\x1b[0m`);
		} else if (input.startsWith("/yell ")) {
			const yellMessage = input.slice(6);
			bot.chat(`🗣️  ${yellMessage}`);
		} else if (input === "/move") {
			console.log('\x1b[1m \x1b[35m Bot moving 🏃‍♂️\x1b[0m');
			bot.setControlState('forward', true);
			setTimeout(() => {
				bot.setControlState('forward', false);
			}, 5000)
		} else if (input === "/hunger") {
			const hunger = (bot.food / 2).toFixed(1);
			console.log(`\x1b[1m \x1b[35m Bot hunger: ${hunger} 🍖\x1b[0m`);
		} else if (input === "/todis") {
			console.log("\x1b[1m \x1b[35m Discord mode activated, go to discord. 🎉\x1b[0m");
			discord = true;
			if (discord){
			discordClient = new Client({
				intents: Object.values(GatewayIntentBits)
			});
			discordClient.login(config.discordToken);
			setTimeout(() => {
				
			}, 3000);
			if (discordClient){
			console.log("\x1b[1m \x1b[35m Discord bot connected\x1b[0m");
		
			discordClient.on("messageCreate", (message) => {
				if (discord){
				if (message.channel.id === config.discordChannelId && config.allowedUserIds.includes(message.author.id)) {
					sendToMinecraft(message.content, message.author.username);
					message.react("✅");
				}
			  }
			});

			// discordClient.user.setActivity(`${config.serverHost}`, {
			// 	type: ActivityType.Playing
			// });
		}
		}	
			sendToDiscord("Discord mode activated. 🎉");
		} else if (input === "/cmdhelp") {
			console.log(`\x1b[1m \x1b[35m Available commands: /antiafk, /listtab, /reconnect, /Rclickslot, /Lclickslot, /closewindow, /health, /coords, /inv, /yell, /move, /hunger, /todis\x1b[0m`);
		} else {
			bot.chat(input);
		}
	} else {
		if (input === "/fpull"){
			sendToDiscord("Controls and chats snatched by console, go to console. 🤖");
			discord = false;
			if (discordClient) {
				discordClient.destroy();
				console.log("\x1b[1m \x1b[35m Discord client closed. 🤖\x1b[0m");
			}
			console.log("\x1b[1m \x1b[35m Console mode activated by force. 🤖\x1b[0m");
		}
	}
});

rl.on('SIGINT', () => {
	rl.question(`Are you sure you want to exit ${config.botUsername}? yes or no `, (answer) => {
	  if (answer.match(/^y(es)?$/i)){
		process.exit()
	}
    });
});

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
//                😌 ✨ eye bleach format
