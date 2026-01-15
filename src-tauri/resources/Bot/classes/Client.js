import {Client as DiscordClient, Partials, GatewayIntentBits } from "discord.js"
import { ClusterClient, getInfo } from 'discord-hybrid-sharding'
import settings from "../data/settings.json" with { type: "json" };
export default class Client {
    client = null
    start() {
        const {token, presenceIntent, membersIntent, messageContentIntent} = settings
        const intents = []
        if(presenceIntent) intents.push(GatewayIntentBits.GuildPresences)
        if(membersIntent) intents.push(GatewayIntentBits.GuildMembers)
        if(messageContentIntent) intents.push(GatewayIntentBits.MessageContent)
        const all = Object.values(GatewayIntentBits).reduce((acc, p) => acc | p, 0);
        const selectable = GatewayIntentBits.GuildPresences | GatewayIntentBits.GuildMembers | GatewayIntentBits.MessageContent;
        const other = all & ~selectable;
        this.client = new DiscordClient({
            intents: [...intents, other],
            partials: [
                Partials.User,
                Partials.GuildMember,
                Partials.Channel,
                Partials.GuildScheduledEvent,
                Partials.Message,
                Partials.Reaction,
                Partials.SoundboardSound,
                Partials.ThreadMember
            ],
            shards: getInfo().SHARD_LIST,
            shardCount: getInfo().TOTAL_SHARDS
        })
        this.client.cluster = new ClusterClient(this.client)
        this.client.login(token)
    }
}