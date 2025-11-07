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
        const onBreak = actionManager.onBreak;
        const onReturn = actionManager.onReturn;

        function restore() {
            actionManager.onContinue = onContinue;
            actionManager.onBreak = onBreak;
            actionManager.onReturn = onReturn;
        }

        const stack = [{ left: 0, right: list.length - 1 }];
        let current = null;
        let pivot = null;
        let i = null;
        let j = null;

        function startPartition(left, right) {
            pivot = list[right];
            i = left - 1;
            j = left;
            current = { left, right };
        }

        function iterate(value) {
            if (current) return partitionStep();

            if (stack.length > 0) {
                const next = stack.pop();
                if (next.left < next.right) {
                    startPartition(next.left, next.right);
                    return partitionStep();
                } else {
                    return iterate(value);
                }
            }

            restore();
            setVariable(data.get("newlist"), list);
            actionManager.runNext(id, "action");
        }

        function partitionStep() {
            if (j < current.right) {
                const a = pivot;
                const b = list[j];

                setVariable(data.get("a"), a);
                setVariable(data.get("b"), b);

                actionManager.onContinue = () => {
                    j++;
                    iterate();
                };

                actionManager.onReturn = (v) => {
                    if (v === list[j]) {
                        i++;
                        [list[i], list[j]] = [list[j], list[i]];
                    }
                    j++;
                    iterate();
                };

                actionManager.onBreak = () => {
                    restore();
                    setVariable(data.get("newlist"), list);
                    actionManager.runNext(id, "action");
                };

                actionManager.runNext(id, "sort");
                return;
            }

            [list[i + 1], list[current.right]] = [list[current.right], list[i + 1]];
            const pivotIndex = i + 1;

            stack.push({ left: current.left, right: pivotIndex - 1 });
            stack.push({ left: pivotIndex + 1, right: current.right });

            current = null;
            iterate();
        }

        iterate();
    }
}
