<script>
    import List from '$lib/components/List.svelte';
	import { App } from '$lib/classes/App.svelte.js';
    import {Label} from "$lib/components/ui/label/index.js";
    import {Input} from "$lib/components/ui/input/index.js";
    import * as Select from "$lib/components/ui/select/index.js";
    import Modal from "$lib/components/Modal.svelte";
    import SearchSelect from "$lib/components/SearchSelect.svelte";
    let selectedVariable = $state("")
    let variableName = $state()
    let variableEditName = $state()
    let variableType = $state("None")
    let variableEditType = $state("None")
    let isCreatingVariable = $state(false);
    let isEditingVariable = $state(false);
    const triggerVariableTypes = $derived(App.selectedBot?.triggerClasses?.map(t => t.variableTypes).flat() ?? [])
    const actionVariableTypes = $derived(App.selectedBot?.actionClasses?.map(t => t.variableTypes).flat() ?? [])
    const variableTypes = $derived([...new Set([...triggerVariableTypes, ...actionVariableTypes])].sort())
    function addVariable() {
        if(!variableName.trim() || variableType.toLowerCase() === "none") return;
        if(App.selectedTrigger?.variables.get(variableName)?.toLowerCase() === variableType.toLowerCase()) return alert("Variable already exists!");
        App.selectedTrigger?.variables.set(variableName, variableType.toLowerCase());
        isCreatingVariable = false;
    }
    function editVariable() {
        if(!variableEditName.trim()) return;
        if(App.selectedTrigger?.variables.has(variableEditName) && selectedVariable !== variableEditName) return alert("Variable already exists!");
        App.selectedTrigger?.variables.delete(selectedVariable)
        App.selectedTrigger?.variables.set(variableEditName, variableEditType.toLowerCase())
        selectedVariable = variableEditName;
        isEditingVariable = false
    }
</script>
<List ondblclick={(item) => {
    variableEditName = selectedVariable;
    variableEditType = App.selectedTrigger?.variables.get(variableEditName);
    isEditingVariable = true;
}} items={App.selectedTrigger?.variables.keys().toArray().sort()} hideControls={!App.selectedTrigger} allowMoving={false} itemTitle={(item) => item} onadd={() => isCreatingVariable = true} ondelete={() => {
    App.selectedTrigger?.variables.delete(selectedVariable);
}} title="Variables" bind:selected={selectedVariable}></List>

<Modal bind:open={isCreatingVariable} title="Create Variable" onDone={addVariable}>
            <div class="grid gap-4 py-4">
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="name" class="text-right">Name</Label>
                    <Input id="name" class="col-span-3 invalid:ring-2 invalid:ring-destructive" required bind:value={variableName} noVariables />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="type" class="text-right">Type</Label>
                    <SearchSelect name="type" values={[{label:"None", value: "None", disabled:true}, ...variableTypes.map(el => ({label: el.split(" ").map(el => `${el[0].toUpperCase()}${el.slice(1).toLowerCase()}`).join(" "), value: el.toLowerCase()}))]} bind:value={variableType} class="col-span-3 w-full {variableType === 'None' ? 'ring-2 ring-destructive' : ''}"/>
                </div>
            </div>
</Modal>
<Modal bind:open={isEditingVariable} title="Edit Variable" onDone={editVariable}>
            <div class="grid gap-4 py-4">
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="name" class="text-right">Name</Label>
                    <Input id="name" class="col-span-3 invalid:ring-2 invalid:ring-destructive" required bind:value={variableEditName} noVariables />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="type" class="text-right">Type</Label>
                    <SearchSelect name="type" values={[{label:"None", value: "None", disabled:true}, ...variableTypes.map(el => ({label: el.split(" ").map(el => `${el[0].toUpperCase()}${el.slice(1).toLowerCase()}`).join(" "), value: el.toLowerCase()}))]} bind:value={variableEditType} class="col-span-3 w-full {variableEditType === 'None' ? 'ring-2 ring-destructive' : ''}"/>
                </div>
            </div>
</Modal>