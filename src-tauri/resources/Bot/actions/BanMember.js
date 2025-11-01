import {ActionManager} from "../classes/ActionManager.js";

export default class BanMember {
    static type = "Ban Member";
    static variableTypes = ["Member"]
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Member"></dbe-label>
            <dbe-variable-list name="member" class="col-span-3" variableType="Member"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Delete message seconds"></dbe-label>
            <dbe-input name="seconds" class="col-span-3"></dbe-input>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Reason"></dbe-label>
            <dbe-input name="reason" class="col-span-3"></dbe-input>
        </div>
    `
    static load(context) {
    }
    static async run({id, data, actionManager, getVariable}) {
        const member = getVariable(data.get('member'));
        let seconds = data.get('seconds');
        let reason = data.get('reason');
        if(!seconds.trim()) seconds = 0;
        if(isNaN(seconds)) seconds = 0;
        if(!reason.trim()) reason = reason.trim()
        await member.ban({deleteMessageSeconds: seconds || undefined, reason: reason || undefined})
        actionManager.runNext(id, "action")
    }
}