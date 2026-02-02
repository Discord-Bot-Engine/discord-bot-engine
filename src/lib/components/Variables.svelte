<script>
    import List from '$lib/components/List.svelte';
	import { App } from '$lib/classes/App.svelte.js';
    import {Label} from "$lib/components/ui/label/index.js";
    import {Input} from "$lib/components/ui/input/index.js";
    import Modal from "$lib/components/Modal.svelte";
    import SearchSelect from "$lib/components/SearchSelect.svelte";
    import {BotManager} from "$lib/classes/BotManager.svelte.js";
    import ErrorIcon from "$lib/components/ErrorIcon.svelte";
    import {ChevronLeftIcon, ChevronRightIcon} from "@lucide/svelte";
    import {Button} from "$lib/components/ui/button/index.js";
    import Translation from "$lib/components/Translation.svelte";
    let selectedVariable = $state("")
    let variableName = $state()
    let variableEditName = $state()
    let variableType = $state("None")
    let variableEditType = $state("None")
    let isCreatingVariable = $state(false);
    let isEditingVariable = $state(false);
    const variableTypes = $derived(BotManager.selectedBot.variableTypes)
    function addVariable() {
        if(!variableName.trim() || variableType.toLowerCase() === "none") return;
        if(App.selectedTrigger?.variables.get(variableName)?.toLowerCase() === variableType.toLowerCase()) return alert("Variable already exists!");
        App.selectedTrigger?.variables.set(variableName, variableType.toLowerCase());
        BotManager.selectedBot.markAsModified(App.selectedTrigger.id);
        isCreatingVariable = false;
    }
    function editVariable() {
        if(!variableEditName.trim()) return;
        if(App.selectedTrigger?.variables.has(variableEditName) && selectedVariable !== variableEditName) return alert("Variable already exists!");
        App.selectedTrigger?.variables.delete(selectedVariable)
        App.selectedTrigger?.variables.set(variableEditName, variableEditType.toLowerCase())
        BotManager.selectedBot.markAsModified(App.selectedTrigger.id);
        const parser = new DOMParser()
        const dom = parser.parseFromString(BotManager.selectedBot.triggerClasses.find(t => t.type === App.selectedTrigger?.type)?.html, 'text/html');
        App.selectedTrigger.data.keys().forEach(key => {
            replace(App.selectedTrigger, key, selectedVariable, variableEditName, dom)
        })
        App.selectedTrigger.actions.forEach(action => {
            const dom = parser.parseFromString(BotManager.selectedBot.actionClasses.find(a => a.type === action.actionType)?.html, 'text/html');
            action.data.keys().forEach(key => {
                replace(action, key, selectedVariable, variableEditName, dom)
            })
        })
        selectedVariable = variableEditName;
        isEditingVariable = false
    }

    function replace(obj, key, variable, newVariable, dom) {
        if(Array.isArray(obj.data.get(key)) && obj.data.get(key)?.every(el => el instanceof CustomElement)) {
               obj.data.get(key).forEach(obj => {
                   obj.data.keys().forEach(key => {
                       replace(obj, key, variable, newVariable, dom);
                   })
               })
        } else {
            if (obj.data.get(key)?.includes(`$\{variables[\`${variable}\`]}`)) {
                obj.data.set(key, obj.data.get(key).replaceAll(`$\{variables[\`${variable}\`]}`, `$\{variables[\`${newVariable}\`]}`))
            }
            [...dom.body.querySelectorAll(`[name="${key}"]`)].forEach(el => {
                if (el.tagName === "DBE-VARIABLE-LIST" && obj.data.get(key) === variable) {
                    obj.data.set(key, newVariable)
                }
            })
        }
    }
</script>

{#snippet html(item, i)}
    {#if !variableTypes.find(t => t.toLowerCase() === App.selectedTrigger?.variables.get(item).toLowerCase())}
        <ErrorIcon />
    {/if}
{/snippet}
<div class="flex bg-card rounded-none shadow-sm max-w-[200px]">
    <Button variant="ghost" class="h-full rounded-none border-1 !p-0" onclick={() => App.hideVariables = !App.hideVariables}>
        {#if !App.hideVariables}
            <ChevronRightIcon/>
        {:else}
            <ChevronLeftIcon/>
        {/if}
    </Button>
    {#if !App.hideVariables}
    <List class="rounded-none border-l-0 shadow-none" ondblclick={() => {
    variableEditName = selectedVariable;
    variableEditType = App.selectedTrigger?.variables.get(variableEditName);
    isEditingVariable = true;
}} {html} items={App.selectedTrigger?.variables.keys().toArray().sort()} hideControls={!App.selectedTrigger} allowMoving={false} itemTitle={(item) => item} onadd={() => isCreatingVariable = true} ondelete={() => {
    BotManager.selectedBot.markAsModified(App.selectedTrigger.id)
    App.selectedTrigger?.variables.delete(selectedVariable);
}} title="Variables" bind:selected={selectedVariable}></List>
        {/if}
        </div>
<Modal bind:open={isCreatingVariable} title="Create Variable" onDone={addVariable}>
            <div class="grid gap-4 py-4 px-1">
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="name" class="text-right"><Translation text="Name"/></Label>
                    <Input id="name" class="col-span-3 invalid:ring-2 invalid:ring-destructive" required bind:value={variableName} noVariables />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="type" class="text-right"><Translation text="Type"/></Label>
                    {#await Promise.all(variableTypes.map( async el => ({label: (await App.translate(el, App.selectedLanguage)).split(" ").map(el => `${el[0].toUpperCase()}${el.slice(1)}`).join(" "), value: el.toLowerCase()}))) then types}
                        {#await App.translate("None", App.selectedLanguage) then none}
                    <SearchSelect name="type" values={[{label:none, value: "None", disabled:true}, ...types]} bind:value={variableType} class="col-span-3 w-full {variableType === 'None' ? 'ring-2 ring-destructive' : ''}"/>
                        {/await}
                    {/await}
                </div>
            </div>
</Modal>
<Modal bind:open={isEditingVariable} title="Edit Variable" onDone={editVariable}>
            <div class="grid gap-4 py-4 px-1">
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="name" class="text-right"><Translation text="Name"/></Label>
                    <Input id="name" class="col-span-3 invalid:ring-2 invalid:ring-destructive" required bind:value={variableEditName} noVariables />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="type" class="text-right"><Translation text="Type"/></Label>
                    {#await Promise.all(variableTypes.map( async el => ({label: (await App.translate(el, App.selectedLanguage)).split(" ").map(el => `${el[0].toUpperCase()}${el.slice(1)}`).join(" "), value: el.toLowerCase()}))) then types}
                        {#await App.translate("None", App.selectedLanguage) then none}
                            <SearchSelect name="type" values={[{label:none, value: "None", disabled:true}, ...types]} bind:value={variableEditType} class="col-span-3 w-full {variableEditType === 'None' ? 'ring-2 ring-destructive' : ''}"/>
                        {/await}
                    {/await}
                </div>
            </div>
</Modal>