import {  useQueue } from "discord-player";

export default class SetQueueSampleRate {
    static type = "Set Queue Sample Rate"
    static title(data) {
        return `Set "${data.get("server")}" queue sample rate to ${data.get("rate")}`
    }
    static variableTypes = []
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Server"></dbe-label>
            <dbe-variable-list name="server" class="col-span-3" variableType="Server"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Sample rate"></dbe-label>
            <dbe-input name="rate" class="col-span-3" value="48000"></dbe-input>
        </div>
    `
    static load(context) {
    }
    static async run({data, actionManager}) {
        const server = actionManager.getVariable(data.get("server"))
        const queue = useQueue(server.id)
        const rate = Number(data.get("rate"))
        queue.filters.resampler.setSampleRate(rate)
        actionManager.runNext()
    }
}