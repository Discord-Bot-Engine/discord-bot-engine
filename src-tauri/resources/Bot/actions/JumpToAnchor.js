export default class JumpToAnchor {
  static type = "Jump To Anchor";
  static title(data) {
    let action = App.selectedTrigger.actions.find(
      (act) => act.id === data.get("action")
    );
    if (!(action instanceof Action) && action) action = Action.fromJSON(action);
    return `Jump to anchor "${action?.data.get("name")}"`;
  }
  static variableTypes = [];
  static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Anchor"></dbe-label>
            <dbe-select name="action" values="" labels="" id="act" class="col-span-3"></dbe-select>
        </div>
    `;
  static load(context) {}
  static open() {
    const action = document.getElementById("act");
    const found = [];
    parseActions(App.selectedTrigger.actions);
    const anchors = found.filter((act) => act.type === "Define Anchor");
    action.setLabels(anchors.map((act) => act.data.get("name")));
    action.setValues(anchors.map((act) => act.id));
    function parseActions(actions) {
      actions.forEach((action) => {
        if (action.isAction) found.push(action);
        if (!(action instanceof Action) && action.isAction)
          action = Action.fromJSON(action);
        if (!(action instanceof CustomElement) && action.isCustom)
          action = CustomElement.fromJSON(action);
        action.data.keys?.().forEach((key) => {
          const val = action.data.get(key);
          if (
            Array.isArray(val) &&
            val.every((el) => el.isAction || el.isCustom)
          ) {
            parseActions(val);
          }
        });
      });
    }
  }
  static async run({ data, actionManager, getVariable }) {
    const trigger = actionManager.trigger;
    const actManager = trigger.actionManagers.find((act) =>
      act.actionList.find((act) => act.id === data.get("action"))
    );
    actManager.runningActionIndex = actManager.actionList.findIndex(
      (act) => act.id === data.get("action")
    );
    actManager.runNext();
  }
}
