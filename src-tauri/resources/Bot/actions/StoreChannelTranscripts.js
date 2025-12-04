import {createTranscript} from "discord-html-transcripts"
export default class StoreChannelTranscripts {
    static type = "Store Channel Transcripts";

    static variableTypes = ["Channel"];

    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Channel"></dbe-label>
            <dbe-variable-list name="channel" class="col-span-3" variableType="Channel"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store transcripts buffer in variable"></dbe-label>
            <dbe-variable-list name="transcripts" class="col-span-3" variableType="Buffer"></dbe-variable-list>
        </div>
    `;

    static load(context) {}

    static async run({ id, data, actionManager, getVariable, setVariable }) {
        const channel = getVariable(data.get("channel"));
        const transcripts = data.get("transcripts");
        const result = await createTranscript(channel, {
            limit: -1,
            returnType: 'buffer',
            saveImages: true,
            footerText: "Exported {number} message{s}",
            poweredBy: false,
            hydrate: true,
            filter: (message) => true
        });
        setVariable(transcripts, result);
        actionManager.runNext(id, "action");
    }
}
