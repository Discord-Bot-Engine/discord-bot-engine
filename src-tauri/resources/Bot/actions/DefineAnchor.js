export default class DefineAnchor {
  static type = "Define Anchor";
  static title(data) {
    return `Define "${data.get("name")}" anchor`;
  }
  static variableTypes = [];
  static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Name"></dbe-label>
            <dbe-input name="name" class="col-span-3"></dbe-input>
        </div>
    `;
  static load(context) {}
  static async run({ data, actionManager, getVariable }) {
    actionManager.runNext();
  }
}
