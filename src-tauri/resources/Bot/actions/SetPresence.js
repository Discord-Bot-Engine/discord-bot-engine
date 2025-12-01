import { ActivityType } from "discord.js";
import {Bot} from "../classes/Bot.js"

export default class SetPresence {
    static type = "Set Presence";

    static variableTypes = [];

    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Status"></dbe-label>
            <dbe-select 
                name="status" 
                class="col-span-3"
                values="Online,Idle,Do Not Disturb,Invisible"
            ></dbe-select>
        </div>
        <dbe-list name="activities" title="Activities" modalId="activitiesModal" itemTitle="async (item, i) => item.data.get('activityType') ? (item.data.get('activityType') + ' ' + item.data.get('activityName')) : await App.translate('Activity', App.selectedLanguage) + ' #' + i"></dbe-list>
        
         <template id="activitiesModal">
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Activity Type"></dbe-label>
            <dbe-select 
                name="activityType" 
                class="col-span-3"
                values="Playing,Streaming,Listening,Watching,Competing,Custom"
                change="(v, el) => el.parentElement.parentElement.querySelector('#url').style.display = v === 'Streaming' ? '' : 'none'"
            ></dbe-select>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Activity Name"></dbe-label>
            <dbe-input name="activityName" class="col-span-3"></dbe-input>
        </div>

        <div class="grid grid-cols-4 items-center gap-4" id="url">
            <dbe-label name="Stream URL"></dbe-label>
            <dbe-input name="streamUrl" class="col-span-3"></dbe-input>
        </div>
        </template>
    `;

    static load() {}

    static async run({ id, data, actionManager }) {
        const status = data.get("status");
        const activityTypeMap = {
            Playing: ActivityType.Playing,
            Streaming: ActivityType.Streaming,
            Listening: ActivityType.Listening,
            Watching: ActivityType.Watching,
            Competing: ActivityType.Competing,
            Custom: ActivityType.Custom,
        };
        const statusTypeMap = {
            "Online": "online",
            "Idle": "idle",
            "Do Not Disturb": "dnd",
            "Invisible": "invisible"
        }
        const presenceData = {
            status: statusTypeMap[status],
            activities: []
        };
        data.get("activities").forEach(({data}) => {
            const activityName = data.get("activityName");
            const activityTypeInput = data.get("activityType");
            const streamUrl = data.get("streamUrl");
            const activityType = activityTypeMap[activityTypeInput];
            const activity = {
                name: activityName,
                type: activityType
            };
            if (activityType === ActivityType.Streaming) {
                activity.url = streamUrl;
            }
            presenceData.activities.push(activity);
        })
        Bot.client.user.setPresence(presenceData);

        actionManager.runNext(id, "action");
    }
}
