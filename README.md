# Mineflayer-Discord-bridge 🤖🌍
A simple mineflayer bot that logs messages and has some cool features 🎉

- This is a Node.js bot that connects to a Minecraft server and a Discord server, allowing users 
  to control the bot and receive updates from the Minecraft server in the Discord channel. 💻🕹️

 ## -- Features -- 🔥
- Connects to a Minecraft server and a Discord server 🌐
- Allows users to control the bot through commands sent in the Discord channel 💬
- Sends updates about the bot's status and the players in the Minecraft server to the Discord channel 📢
- Blocks certain messages from being sent to the Minecraft server 🛑
- Automatically reconnects to the Minecraft server if the bot disconnects 🔄
- Has prismarine-viewer to look at what your bot is up to, right click on the map to move bot to that point 😮

## -- Requirements -- 📋
- Node.js (version 19 or higher) 🚀
- An ngrok account and authentication token 🔑
- A Discord bot token 🤖
- A Minecraft server to connect to 🏢

## -- Installation -- 🛠️
Clone the repository:
```
git clone https://github.com/Dr4cule/Mineflayer-Discord-bridge.git
```
Install the required dependencies:
```
cd Mineflayer-Discord-bridge
npm install @ngrok/ngrok discord.js mineflayer@latest mineflayer-pathfinder prismarine-viewer minecraft-data
```
- Note: If you are facing issues with installing, try installing one package at a time and ```npm audit fix --force```
  
To get the discord channel id and discord user ids:
- go to discord settings, go to advance and enable developer mode then 🔧
- right click on the discord channel, copy its id and paste it in the config file where it says to paste 📂
- right click on discord users and copy their id and paste it in the config file where it says to paste for them to be able to use the
- bot and its commands. 🙋‍♂️

## -- Installation for Termux -- 🤖
- Install Termux from the Play Store or F-Droid.
- Open Termux and run the following commands:
  
  ```
  pkg update && pkg upgrade
  pkg install nodejs git
  git clone https://github.com/Dr4cule/Mineflayer-Discord-bridge.git
  cd Mineflayer-Discord-bridge
  npm install @ngrok/ngrok discord.js mineflayer@latest mineflayer-pathfinder prismarine-viewer minecraft-data
  ```
  - Note: If you are facing issues with installing, try installing one package at a time and ```npm audit fix --force```
    
To get the discord channel id and discord user ids:
- go to discord settings, go to advance and enable developer mode then 🔧
- right click on the discord channel, copy its id and paste it in the config file where it says to paste 📂
- right click on discord users and copy their id and paste it in the config file where it says to paste for them to be able to use the
- bot and its commands. 🙋‍♂️  
  
- Follow the rest of the steps as 
## -- Ngrok -- 🌐
- To get your ngrok token visit [ngrok](https://dashboard.ngrok.com/get-started/your-authtoken), click on the link after you log in if you are lost. 🔑
- Paste your ngrok token to the specified place in ```config.json``` 📝

Making a discord bot: 🤖

- Go to [devportal](https://discord.com/developers/applications) and make an application, go to "Bot" and enable all the 3 "Privileged Gateway Intents" 🔍
- then go to "OAuth2", put this link in the redirect box https://discordapp.com/oauth2/authorize?&client_id=Bots_client_id&scope=bot, 🔗
- get the application id from "Genearal Information" and replace ```Bots_client_id``` with the one you copied, after editing the link 
- in redirect box as directed, select "bot" in "OAuth2 URL Generator" and select "Administrator" in "Bot permissions and then 
- copy the link it gives you at the bottom, paste it in your website and invite the bot to your server. 🙌
- Get your discord bot token from "Bot" at [devportal](https://discord.com/developers/applications) to paste it in ```config.json```,
- click on reset at near token if you have lost or forgotten your token and update ```config.json``` with your new bot token. 🔑

Configure ```config.json``` file with your requirements: 🔧

- The bot's configuration is stored in the ```config.json``` file. Here's a breakdown of the available settings:

- ```ngrokAuthToken```: The authentication token for the ngrok service.
- ```botUsername```: The username of the bot in the Minecraft server.
- ```botPswd```: The password for the bot's Minecraft account.
- ```serverHost```: The hostname of the Minecraft server.
- ```serverPort```: The port number of the Minecraft server.
- ```serverVersion```: The version of the Minecraft server.
- ```botAuth```: The authentication method for the bot (either "offline" or "microsoft").
- ```botPass```: The password for the bot's Minecraft account.
- ```discordToken```: The authentication token for the Discord bot.
- ```discordChannelId```: The ID of the Discord channel where the bot will send messages.
- ```allowedUserIds```: The list of Discord user IDs that are allowed to send commands to the bot.
- ```BlockedMessages```: The list of messages that the bot will ignore.

Once everything is done and set up run the bot using:
```
node index.js
```
 ## -- Usage -- 🕹️
- Send commands to the bot in the Discord channel specified in the ```config.json``` file.
- The bot will execute the commands in the Minecraft server and send updates back to the Discord channel.
  
# Available commands:

- ```/move```: Moves the bot forward for 5 seconds. 🚶‍♂️
- ```/listtab```: Sends a list of players currently in the Minecraft server to the Discord channel. 📋
- ```/reconnect```: Disconnects the bot from the Minecraft server and attempts to reconnect. 🔁
- ```/Rclickslot <slot>```: Right-clicks the specified hotbar slot. 🖱️ example: ```/Rclickslot 4```
- ```/Lclickslot <slot>```: Left-clicks the specified hotbar slot. 🖱️  example: ```/Lclickslot 12```
- ```/closewindow```: Closes the currently open window. 🔒

- You can also set a pattern of clicks the bot should initiate on login to directly join in to the sub-server of a minecraft server. 🤖
- Example commented out in ```index.js```

 ## -- Contributing -- 🤝
- If you find any issues or have suggestions for improvements, feel free to create a new issue or submit a pull request. 🙌

## License 📜
 Works on my machine 👍 💀 
 Hope it does on yours as well 😅
 
 [MIT](https://choosealicense.com/licenses/mit/)
