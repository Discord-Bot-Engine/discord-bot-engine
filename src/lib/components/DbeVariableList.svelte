<svelte:options customElement={{tag: "dbe-variable-list", shadow: "none"}} />
<script>
    import {App} from "$lib/classes/App.svelte.js";
    import SearchSelect from "$lib/components/SearchSelect.svelte";
    import {BotManager} from "$lib/classes/BotManager.svelte.js";
    import {Label} from "$lib/components/ui/label/index.js";
    import {Input} from "$lib/components/ui/input/index.js";
    import Modal from "$lib/components/Modal.svelte";
    import Translation from "$lib/components/Translation.svelte";
    let {variableType, change = "() => {}", labels="", ...other} = $props()
    let types = $state(variableType.split(",").map(el => el.toLowerCase()))
    let variables = $derived(App.selectedTrigger.variables)
    let statevalues = $derived(variables.keys().toArray().sort().filter(v => types.includes(variables.get(v).toLowerCase()) || types.includes("any")))
    let statevalue = $state(undefined)
    let newVariableName = $state()
    let newVariableType = $state("None")
    let isCreatingVariable = $state(false);
    const variableTypes = $derived(BotManager.selectedBot.variableTypes)
    function addVariable() {
        if(!newVariableName.trim() || newVariableType.toLowerCase() === "none") return;
        if(App.selectedTrigger?.variables.get(newVariableName)?.toLowerCase() === newVariableType.toLowerCase()) return alert("Variable already exists!");
        App.selectedTrigger?.variables.set(newVariableName, newVariableType.toLowerCase());
        BotManager.selectedBot.markAsModified(App.selectedTrigger.id);
        isCreatingVariable = false;
        statevalue = newVariableName
    }
    function customSort(arr) {
        if (arr.every(item => !isNaN(item))) {
            return arr.sort((a, b) => a - b);
        } else {
            return arr.map(String).sort((a, b) => a.localeCompare(b));
        }
    }
    $host().setVariableType = (newType) => {
        types = [newType].flat().map(el => el.toLowerCase());
    }
    $host().setValue = (value) => {
        if(value === undefined) return;
        statevalue = value
    }
    $host().getValue = () => statevalue
    $host().init = () => {
        change = eval(`(${change})`)
        change(statevalue, $host())
    }
</script>
{#await App.translate("Add Variable", App.selectedLanguage) then text}
<SearchSelect extra={
{
    label: text,
    onclick: () => isCreatingVariable = true
}
} {...other} values={customSort(statevalues.filter(el => el.trim())).map((el,i)=>({label: el, value:el}))} onvaluechange={(v) => change(v, $host())} bind:value={statevalue}/>
<Modal bind:open={isCreatingVariable} title="Create Variable" onDone={addVariable}>
    <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
            <Label for="name" class="text-right"><Translation text="Name"/></Label>
            <Input id="name" class="col-span-3 invalid:ring-2 invalid:ring-destructive" required bind:value={newVariableName} noVariables />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <Label for="type" class="text-right"><Translation text="Type"/></Label>
            {#await variableTypes.filter(v => types.includes(v.toLowerCase()) || types.includes("any")).map( async el => ({label: (await App.translate(el, App.selectedLanguage)).split(" ").map(el => `${el[0].toUpperCase()}${el.slice(1)}`).join(" "), value: el.toLowerCase()})) then types}
                {#await App.translate("None", App.selectedLanguage) then none}
                <SearchSelect name="type" values={[{label:"None", value: "None", disabled:true}, ...types]} bind:value={newVariableType} class="col-span-3 w-full {newVariableType === 'None' ? 'ring-2 ring-destructive' : ''}"/>
                {/await}
            {/await}
        </div>
    </div>
</Modal>
{/await}