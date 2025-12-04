import { ClusterManager } from 'discord-hybrid-sharding';
import settings from "./data/settings.json" with {type: "json"}
import {fileURLToPath} from "url";
import {dirname} from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const clusters = []

process.on('exit', () => {
    exit();
});
process.on('SIGINT', () => {
    exit();
});
process.on('SIGHUP', () => {
    exit();
});

process.stdin.on('data', (data) => {
    data = data.toString()
    if(data === "$DBE$$$ STOP") return exit();
    if(data === "$DBE$$$ ATTACH DEBUGGER") return clusters.forEach((c) => { c.send({attachDebugger: true}) })
    if(data === "$DBE$$$ REMOVE DEBUGGER") return clusters.forEach((c) => { c.send({removeDebugger: true}) })
    clusters.forEach((c) => { c.send({content: data}) })
})

const manager = new ClusterManager(`${__dirname}/shard.js`, {
    totalShards: 'auto',
    shardsPerClusters: 2,
    mode: 'worker',
    token: settings.token,
});

manager.on('clusterCreate', cluster => {
    cluster.on("spawn", () => {
        clusters.push(cluster)
        cluster.send({npm: process.argv[2]?.replace("\\\\?\\", "") ?? "none"})
    })
})
manager.spawn({ timeout: -1 });

function exit() {
    clusters.forEach(cluster => cluster.send({offline: true}));
    setTimeout(() => {
        process.exit(0)
    }, 500)
}