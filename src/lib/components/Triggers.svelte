<script>
    import { v4 as uuidv4 } from "uuid";
    import List from '$lib/components/List.svelte';
	import { App } from '$lib/classes/App.svelte.js';
    import {Label} from "$lib/components/ui/label/index.js";
    import {Input} from "$lib/components/ui/input/index.js";
    import Trigger from "$lib/classes/Trigger.svelte.js";
    import Modal from "$lib/components/Modal.svelte";
    import SearchSelect from "$lib/components/SearchSelect.svelte";
    import {BotManager} from "$lib/classes/BotManager.svelte.js";
    import ErrorIcon from "$lib/components/ErrorIcon.svelte";
	let triggers = $derived(BotManager.selectedBot?.triggers);
    let triggerName = $state()
    let triggerEditName = $state()
    let triggerType = $state("None")
    let isCreatingTrigger = $state(false);
    let isEditingTrigger = $state(false);
    let ref;
    let handlersCopy = {}
    function addTrigger() {
        if(!triggerName.trim() || triggerType.toLowerCase() === "none") return;
        if(BotManager.selectedBot.triggers.find(t => t.name === triggerName.trim() && t.type === triggerType)) return alert("Trigger already exists!");
        const id = uuidv4()
        BotManager.selectedBot.triggers.push(new Trigger(id, triggerType, triggerName.trim()))
        BotManager.selectedBot.markAsModified(id)
        isCreatingTrigger = false;
    }
    function editTrigger() {
        if(!triggerEditName.trim()) return;
        if(BotManager.selectedBot.triggers.find(t => t.name === triggerEditName.trim() && t.type === App.selectedTrigger.type) && App.selectedTrigger.name !== triggerEditName) return alert("Trigger already exists!");
        App.selectedTrigger.name = triggerEditName
        BotManager.selectedBot.markAsModified(App.selectedTrigger.id)
        Object.keys(handlersCopy).forEach(handler => {
            window.handlers[handler] = handlersCopy[handler];
        })
        handlersCopy = window.handlers
        const data = App.selectedTrigger.data
        App.saveUIData(ref, data)
        isEditingTrigger = false
    }
</script>
{#snippet html(item, i)}
    {#if !BotManager.selectedBot.triggerClasses.find(t => t.type === item.type)}
        <ErrorIcon />
    {/if}
{/snippet}
<List ondblclick={() => {
    triggerEditName = App.selectedTrigger.name;
    const triggerClass = BotManager.selectedBot.triggerClasses.find(t => t.type === App.selectedTrigger.type);
    if(!triggerClass) return alert("Trigger failed to load.");
    isEditingTrigger = true;
    let interval = setInterval(async () => {
        if(!ref) return;
        clearInterval(interval);
        const data = App.selectedTrigger.data
        App.loadUIData(ref, data)
        handlersCopy = window.handlers
        Object.freeze(handlersCopy)
        window.handlers = {}
        try {
            await triggerClass?.open?.(App.selectedTrigger, window.handlers)
        } catch (e) {
            alert(`${triggerClass.type}\n${e.stack}`)
        }
    }, 10)
}} allowMoving={false} {html} items={triggers ?? []} itemTitle={(item) => item.name} onadd={() => isCreatingTrigger = true} ondelete={() => {
    BotManager.selectedBot.triggers = BotManager.selectedBot.triggers.filter(el => el !== App.selectedTrigger)
    BotManager.selectedBot.markAsRemoved(App.selectedTrigger.id)
}} title="Triggers" bind:selected={App.selectedTrigger}></List>

<Modal bind:open={isCreatingTrigger} title="Create Trigger" onDone={addTrigger}>
    <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
            <Label for="name" class="text-right">Name</Label>
            <Input id="name" class="col-span-3 invalid:ring-2 invalid:ring-destructive" required bind:value={triggerName} noVariables />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <Label for="type" class="text-right">Type</Label>
            <SearchSelect name="type" values={[{label:"None", value: "None", disabled:true}, ...(BotManager.selectedBot?.triggerClasses ?? []).map(el => el.type).sort().map(el => ({label: el, value: el}))]} bind:value={triggerType} class="col-span-3 w-full {triggerType === 'None' ? 'ring-2 ring-destructive' : ''}"/>
        </div>
    </div>
</Modal>
<Modal bind:open={isEditingTrigger} title="{App.selectedTrigger?.name} - {App.selectedTrigger?.type}" onDone={editTrigger}>

        <div class="grid gap-4 py-4" bind:this={ref}>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="name" class="text-right">Name</Label>
                    <Input id="name" class="col-span-3 invalid:ring-2 invalid:ring-destructive" required bind:value={triggerEditName} noVariables />
                </div>
                {@html BotManager.selectedBot.triggerClasses.find(t => t.type === App.selectedTrigger.type)?.html ?? ""}
        </div>
</Modal>