import {  useQueue } from "discord-player";

export default class SetQueueReverb {
    static type = "Set Queue Reverb"
    static variableTypes = []
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Server"></dbe-label>
            <dbe-variable-list name="server" class="col-span-3" variableType="Server"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Room size"></dbe-label>
            <dbe-input name="roomSize" class="col-span-3" value="0.5"></dbe-input>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Damping"></dbe-label>
            <dbe-input name="damping" class="col-span-3" value="0.5"></dbe-input>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Wet level"></dbe-label>
            <dbe-input name="wetLevel" class="col-span-3" value="0.5"></dbe-input>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Dry level"></dbe-label>
            <dbe-input name="dryLevel" class="col-span-3" value="0.5"></dbe-input>
        </div>
    `
    static load(context) {
    }
    static async run({id, data, actionManager, getVariable}) {
        const server = getVariable(data.get("server"))
        const queue = useQueue(server.id)
        const roomSize = Number(data.get("roomSize"))
        const damping = Number(data.get("damping"))
        const wetLevel = Number(data.get("wetLevel"))
        const dryLevel = Number(data.get("dryLevel"))
        queue.filters.reverb.setReverb({
            roomSize,
            damping,
            wetLevel,
            dryLevel
        })
        actionManager.runNext(id, "action")
    }
}