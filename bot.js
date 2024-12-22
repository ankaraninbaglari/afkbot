const mineflayer = require('mineflayer');

// Server details
const servers = [
    { host: 'premium.blocksmc.com', port: 25565 },
    { host: 'premium.nektax.net', port: 25565 },
];

async function createBot(server) {
    const bot = mineflayer.createBot({
        host: server.host,
        port: server.port,
        auth: 'microsoft', // Use Microsoft login
        version: '1.8',    // Force the bot to use Minecraft 1.8
    });
    

    bot.on('login', () => {
        console.log(`Bot logged into ${server.host}`);
    });

    bot.on('spawn', () => {
        console.log(`Bot spawned on ${server.host}`);
        setInterval(() => {
            bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), 1000);
        }, 75000); // Jump every 30 seconds to prevent AFK kick
    });

    bot.on('end', () => {
        console.log(`Disconnected from ${server.host}, reconnecting...`);
        setTimeout(() => createBot(server), 5000); // Reconnect after 60 seconds
    });

    bot.on('error', (err) => {
        console.error(`Error on ${server.host}:`, err);
    });

    bot.on('kicked', (reason) => {
        try {
            const readableReason = JSON.stringify(reason, null, 2);
            console.log(`Kicked from ${server.host}:`, readableReason);
        } catch {
            console.log(`Kicked from ${server.host}:`, reason);
        }
    });
}

async function connectServers(servers) {
    for (const server of servers) {
        await new Promise((resolve) => {
            createBot(server);
            setTimeout(resolve, 10000); // Wait 30 seconds before connecting to the next server
        });
    }
}

connectServers(servers);
