import {  useQueue } from "discord-player";

export default class SetQueueCompressor {
    static type = "Set Queue Compressor"
    static title(data) {
        return `Set "${data.get("server")}" queue compressor to ${data.get("threshold")},${data.get("ratio")},${data.get("attack")},${data.get("release")},${data.get("makeupGain")},${data.get("kneeWidth")}`
    }
    static variableTypes = []
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Server"></dbe-label>
            <dbe-variable-list name="server" class="col-span-3" variableType="Server"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Threshold"></dbe-label>
            <dbe-input name="threshold" class="col-span-3" value="-20"></dbe-input>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Ratio"></dbe-label>
            <dbe-input name="ratio" class="col-span-3" value="3"></dbe-input>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Attack"></dbe-label>
            <dbe-input name="attack" class="col-span-3" value="0.1"></dbe-input>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Release"></dbe-label>
            <dbe-input name="release" class="col-span-3" value="0.1"></dbe-input>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Makeup gain"></dbe-label>
            <dbe-input name="makeupGain" class="col-span-3" value="0"></dbe-input>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Knee width"></dbe-label>
            <dbe-input name="kneeWidth" class="col-span-3" value="0"></dbe-input>
        </div>
    `
    static load(context) {
    }
    static async run({data, actionManager}) {
        const server = actionManager.getVariable(data.get("server"))
        const queue = useQueue(server.id)
        const threshold = Number(data.get("threshold"))
        const ratio = Number(data.get("ratio"))
        const attack = Number(data.get("attack"))
        const release = Number(data.get("release"))
        const makeupGain = Number(data.get("makeupGain"))
        const kneeWidth = Number(data.get("kneeWidth"))
        queue.filters.compressor.setCompressor({
            threshold,
            ratio,
            attack,
            release,
            makeupGain,
            kneeWidth
        })
        actionManager.runNext()
    }
}