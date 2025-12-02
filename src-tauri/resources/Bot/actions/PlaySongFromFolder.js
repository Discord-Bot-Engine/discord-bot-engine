import { Bot } from "../classes/Bot.js";
import {Player, QueryType, useMainPlayer, useQueue} from "discord-player";
import { AttachmentExtractor } from "@discord-player/extractor";

export default class PlaySongFromFolder {
    static type = "Play Song From Folder"
    static variableTypes = ["Channel"]
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Voice channel"></dbe-label>
            <dbe-variable-list name="vc" class="col-span-3" variableType="Channel"></dbe-variable-list>
        </div>
         <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Folder to search song"></dbe-label>
            <dbe-input name="folder" class="col-span-3" value="./"></dbe-input>
        </div>
        <dbe-list name="ext" title="File Extensions" modalId="extModal" itemTitle="(item, i) => item.data.get('ext') ?? ('File Extension #'+i)"></dbe-list>
        <div id="extModal">
            <div class="grid grid-cols-4 items-center gap-4">
                <dbe-label name="File extension"></dbe-label>
                <dbe-input name="ext" class="col-span-3" value=".mp3"></dbe-input>
            </div>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Song"></dbe-label>
            <dbe-input name="song" class="col-span-3"></dbe-input>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Clear queue?"></dbe-label>
            <dbe-select name="clear" values="True,False" value="False" class="col-span-3"></dbe-select>
        </div>
    `
    static load(context) {
        if(!Bot.player) {
            Bot.player = new Player(Bot.client);
            Bot.player.events.on("error", console.log)
            Bot.player.events.on("playerError", console.log)
            Bot.player.extractors.register(AttachmentExtractor, {});
        }
        if(!Bot.player.extractors.get(AttachmentExtractor.identifier)) Bot.player.extractors.register(AttachmentExtractor, {});

    }
    static async run({id, data, actionManager, getVariable}) {
        const player = useMainPlayer()
        const vc = getVariable(data.get("vc"))
        const folder = data.get("folder")
        const song = data.get("song")
        const clear = data.get("clear") === "True"
        if(clear) {
            const queue = useQueue(vc.guild.id)
            queue.delete()
        }
        const extensions = data.get("ext").map(({data}) => data.get("ext"))
        const { simpleFolderSearch } = require("simple-folder-search")
        const musicFiles = await simpleFolderSearch(folder, extensions, song);
        await player.play(vc, musicFiles[0], {
            searchEngine: QueryType.FILE,
            nodeOptions: {
                disableSeeker: false
            }
        })
        actionManager.runNext(id, "action")
    }
}