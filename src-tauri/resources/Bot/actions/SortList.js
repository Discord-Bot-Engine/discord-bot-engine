import { ActionManager } from "../classes/ActionManager.js";

export default class SortList {
    static type = "Sort List";
    static variableTypes = ["List"];
    static outputs = ["action", "sort"];
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="List"></dbe-label>
            <dbe-variable-list name="list" class="col-span-3" variableType="List"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store element A in variable"></dbe-label>
            <dbe-variable-list name="a" class="col-span-3" variableType="Any"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store element B in variable"></dbe-label>
            <dbe-variable-list name="b" class="col-span-3" variableType="Any"></dbe-variable-list>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store sorted list in variable"></dbe-label>
            <dbe-variable-list name="newlist" class="col-span-3" variableType="List"></dbe-variable-list>
        </div>
    `;

    static load(context) {}

    static async run({ id, data, actionManager, setVariable, getVariable }) {
        const list = [...getVariable(data.get("list"))];
        const onContinue = actionManager.onContinue;
        const onReturn = actionManager.onReturn;
        const onBreak = actionManager.onBreak;

        let i = 0;
        let j = 0;
        let swapped = false;

        function restore() {
            actionManager.onContinue = onContinue;
            actionManager.onReturn = onReturn;
            actionManager.onBreak = onBreak;
        }

        function nextStep() {
            if (i >= list.length - 1) {
                if (!swapped) {
                    // done sorting
                    setVariable(data.get("newlist"), list);
                    restore();
                    actionManager.runNext(id, "action");
                    return;
                }
                swapped = false;
                i = 0;
                j = 1;
            } else {
                j = i + 1;
            }
            compare();
        }

        function compare() {
            if (j >= list.length) {
                i++;
                nextStep();
                return;
            }

            const a = list[i];
            const b = list[j];
            setVariable(data.get("a"), a);
            setVariable(data.get("b"), b);

            // --- override handlers for this iteration ---
            actionManager.onReturn = (v) => {
                if (v === b) {
                    // swap
                    list[i] = b;
                    list[j] = a;
                    swapped = true;
                }
                j++;
                compare();
            };

            // Skip comparison if "continue" is called
            actionManager.onContinue = () => {
                j++;
                compare();
            };

            // End sorting early if "break" is called
            actionManager.onBreak = () => {
                restore();
                actionManager.runNext(id, "action");
            };
            // --- end overrides ---

            actionManager.runNext(id, "sort");
        }

        nextStep();
    }
}
