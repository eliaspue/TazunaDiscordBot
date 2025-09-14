# TazunaBot

A Discord bot for managing your umamusume club and other nifty uma commands. 
Any questions? Join the discord https://discord.gg/5BW4gSUVSz
---

## 🚀 Getting Started
Follow these steps to run the bot locally. You can also host this bot on a free server like pella.



### 1. Install dependencies
Before you start, you'll need to install [NodeJS](https://nodejs.org/en/download/) and [create a Discord app](https://discord.com/developers/applications). Feel free to name the bot anything you want and upload a nice icon.

### 2. Clone the repository
```
git clone https://github.com/JustWastingTime/TazunaDiscordBot.git
cd TazunaDiscordBot  
npm install  
```

### 3. Create your credentials file
Rename .env.sample to just .env.  
Head to the discord app you just created and copy the application id (`APP_ID`) and public key (`PUBLIC_KEY`) into the .env file. Then head into the Bot page and generate a Bot Token and save it as (`DISCORD_TOKEN`) in the .env.
![Finding the secrets](./assets/readmeimg/tutorial01.png)


### 4. Install slash commands

The commands are set up in `commands.js` (more on the commands later). All of the commands in the `ALL_COMMANDS` array at the bottom of `commands.js` will be installed when you run the `register` command configured in `package.json`:

```
npm run register
```

### 5. Run the app

After your credentials are added, go ahead and run the app:

```
npm run start
```

### 6. Set up interactivity

The project needs a public endpoint where Discord can send requests. To develop and test locally, you can use something like [`ngrok`](https://ngrok.com/) to tunnel HTTP traffic.

Install ngrok if you haven't already, then start listening on port `3000`:

```
ngrok http 3000
```

You should see your connection open:

```
Tunnel Status                 online
Version                       2.0/2.0
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://1234-someurl.ngrok.io -> localhost:3000

Connections                  ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

Copy the forwarding address that starts with `https`, in this case `https://1234-someurl.ngrok.io`, then go to your [app's settings](https://discord.com/developers/applications).

On the **General Information** tab, there will be an **Interactions Endpoint URL**. Paste your ngrok address there, and append `/interactions` to it (`https://1234-someurl.ngrok.io/interactions` in the example).

Click **Save Changes**, and your app should be ready to run 🚀
![Setting up the discord endpoint url with ngrok](./assets/readmeimg/tutorial01.png)

