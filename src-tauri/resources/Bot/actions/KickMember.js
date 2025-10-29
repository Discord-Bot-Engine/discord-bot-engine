
export default class KickMember {
    static type = "Kick Member";
    static title(data) {
        return `Kick "${data.get("member")}"`
    }
    static variableTypes = ["Member"]
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Member"></dbe-label>
            <dbe-variable-list name="member" class="col-span-3" variableType="Member"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Reason"></dbe-label>
            <dbe-input name="reason" class="col-span-3"></dbe-input>
        </div>
    `
    static load(context) {
    }
    static async run({data, actionManager, getVariable}) {
        const member = getVariable(data.get('member'));
        let reason = data.get('reason');
        if(!reason.trim()) reason = reason.trim()
        await member.kick(reason || undefined)
        actionManager.runNext()
    }
}