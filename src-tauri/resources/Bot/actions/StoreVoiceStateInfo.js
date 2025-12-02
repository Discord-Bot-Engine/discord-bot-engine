import { Bot } from "../classes/Bot.js"

export default class StoreVoiceStateInfo {
    static type = "Store Voice State Info"

    static variableTypes = ["Voice State", "Channel", "Boolean", "Text", "Number", "Server"];

    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Voice State"></dbe-label>
            <dbe-variable-list name="voice" class="col-span-3" variableType="Voice State"></dbe-variable-list>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Info"></dbe-label>
            <dbe-select 
                name="info" 
                class="col-span-3" 
                change="(v) => handlers.onChange(v)"
                values="Channel,Server,Session ID,Is Deaf,Is Self Deaf,Is Muted,Is Self Muted,Is Self Video Enabled,Is Streaming,Is Suppressed,Request to Speak Timestamp"
            ></dbe-select>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store value in variable"></dbe-label>
            <dbe-variable-list 
                name="value" 
                id="var" 
                class="col-span-3" 
                variableType="Text,Boolean,Number,Channel,Server">
            </dbe-variable-list>
        </div>
    `;

    static open(action, handlers) {
        const varlist = document.getElementById("var");

        handlers.onChange = (value) => {

            const booleanOptions = [
                "Is Deaf", "Is Self Deaf",
                "Is Muted", "Is Self Muted",
                "Is Self Video Enabled",
                "Is Streaming",
                "Is Suppressed",
            ];

            if (booleanOptions.includes(value)) {
                varlist.setVariableType("Boolean");
            }

            else if (["Session ID"].includes(value)) {
                varlist.setVariableType("Text");
            }

            else if (["Channel"].includes(value)) {
                varlist.setVariableType("Channel");
            }

            else if (["Server"].includes(value)) {
                varlist.setVariableType("Server");
            }

            else if (["Request to Speak Time"].includes(value)) {
                varlist.setVariableType("Number");
            }

            else {
                varlist.setVariableType("Text");
            }
        };
    }

    static load(context) {}

    static async run({ id, data, actionManager, getVariable, setVariable }) {
        const voiceState = getVariable(data.get("voice"));
        const info = data.get("info");

        if (!voiceState) {
            setVariable(data.get("value"), null);
            return actionManager.runNext(id, "action");
        }

        let value;

        switch (info) {
            case "Channel":
                value = voiceState.channel;
                break;

            case "Server":
                value = voiceState.guild;
                break;

            case "Session ID":
                value = voiceState.sessionId;
                break;

            case "Is Deaf":
                value = voiceState.deaf;
                break;

            case "Is Self Deaf":
                value = voiceState.selfDeaf;
                break;

            case "Is Muted":
                value = voiceState.mute;
                break;

            case "Is Self Muted":
                value = voiceState.selfMute;
                break;

            case "Is Self Video Enabled":
                value = voiceState.selfVideo;
                break;

            case "Is Streaming":
                value = voiceState.streaming;
                break;

            case "Is Suppressed":
                value = voiceState.suppress;
                break;

            case "Request to Speak Timestamp":
                value = voiceState.requestToSpeakTimestamp;
                break;

            default:
                value = null;
                break;
        }

        setVariable(data.get("value"), value);
        actionManager.runNext(id, "action");
    }
}
