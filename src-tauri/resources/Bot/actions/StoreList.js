export default class StoreList {
    static type = "Store List"
    static variableTypes = ["List"]
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Store list in variable"></dbe-label>
            <dbe-variable-list name="value" class="col-span-3" variableType="List"></dbe-variable-list>
        </div>
        <dbe-list name="elements" title="Elements" modalId="elementsModal" itemTitle="async (item, i) => item.data.get('value') ?? await App.translate('Element', App.selectedLanguage) + ' #' + i"></dbe-list>
         <template id="elementsModal">
            <div class="grid grid-cols-4 items-center gap-4">
                <dbe-label name="Value"></dbe-label>
                <dbe-variable-list name="value" class="col-span-3" variableType="Any"></dbe-variable-list>
            </div>
        </template>    
`
    static load(context) {
    }
    static async run({id, data, actionManager, getVariable, setVariable}) {
        setVariable(data.get("value"), data.get("elements").map(el => getVariable(el.data.get('value'))))
        actionManager.runNext(id, "action")
    }
}