import {Bot} from "./classes/Bot.js";
import {Dashboard} from "./classes/Dashboard.js";

process.on('uncaughtException', (err) => {
    console.log(err.stack);
});
process.on('unhandledRejection', (err) => {
    console.log(err.stack);
});

Bot.start()
if(Bot.client.cluster.id === 0)
    Dashboard.start()

Bot.client.cluster.on('message', message => {
    if(message.offline) return exit()
    if(message.attachDebugger) Bot.attachDebugger()
    if(message.removeDebugger) Bot.removeDebugger()
});

async function exit() {
    Bot.client.emit('exit');
    await Bot.client.destroy()
    setTimeout(() => {
        process.exit(0)
    }, 100)
}