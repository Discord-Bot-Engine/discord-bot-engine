export default class LockThread {
    static type = "Lock Thread";

    static variableTypes = ["Channel"];

    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Thread"></dbe-label>
            <dbe-variable-list name="thread" class="col-span-3" variableType="Channel"></dbe-variable-list>
        </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Lock?"></dbe-label>
            <dbe-select name="lock" class="col-span-3" value="True" values="True,False"></dbe-select>
        </div>
    `;

    static load() {}

    static async run({ id, data, actionManager, getVariable }) {
        const thread = getVariable(data.get("thread"));
        const lock = data.get("lock") === "True";
        await thread.setLocked(lock);
        actionManager.runNext(id, "action");
    }
}
