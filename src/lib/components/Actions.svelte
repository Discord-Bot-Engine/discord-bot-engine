<script>
    import { v4 as uuidv4 } from "uuid";
    import List from '$lib/components/List.svelte';
    import { App } from '$lib/classes/App.svelte.js';
    import {Label} from "$lib/components/ui/label/index.js";
    import Action from "$lib/classes/Action.svelte.js";
    import Modal from "$lib/components/Modal.svelte";
    import SearchSelect from "$lib/components/SearchSelect.svelte";
    import {BotManager} from "$lib/classes/BotManager.svelte.js";
    import ErrorIcon from "$lib/components/ErrorIcon.svelte";
	let {actions = $bindable(), title} = $props();
    let selectedAction = $state(null)
    let actionType = $state("None")
    let isCreatingAction = $state(false);
    let isEditingAction = $state(false);
    let open = $state(false)
    let ref;
    let handlersCopy = {}
    function addAction() {
        if(actionType.toLowerCase() === "none") return;
        actions.push(new Action(uuidv4(), actionType))
        BotManager.selectedBot.markAsModified(App.selectedTrigger.id)
        isCreatingAction = false;
    }
    function editAction() {
        Object.keys(handlersCopy).forEach(handler => {
            window.handlers[handler] = handlersCopy[handler];
        })
        handlersCopy = window.handlers
        const data = selectedAction.data
        App.saveUIData(ref, data)
        BotManager.selectedBot.markAsModified(App.selectedTrigger.id)
        isEditingAction = false
    }
    function itemTitle(item, i) {
        const actionClass = BotManager.selectedBot.actionClasses.find(a => a.type === item.type)
        if(!actionClass) return `${i+1}. Unknown Action`
        if(item.data.keys().toArray().length === 0 || !actionClass.title) return `${i+1}. ${item.type}`
        const title = actionClass.title?.(item.data)
        return `${i+1}. ${title}`
    }
</script>
{#snippet html(item, i)}
    {#if !BotManager.selectedBot.actionClasses.find(a => a.type === item.type)}
       <ErrorIcon />
    {/if}
{/snippet}
<List ondnd={() => {
        BotManager.selectedBot.markAsModified(App.selectedTrigger.id)
}} ondblclick={() => {
    const actionClass = BotManager.selectedBot.actionClasses.find(act => act.type === selectedAction.type);
    if(!actionClass) return alert("Action failed to load.");
    isEditingAction = true;
    let interval = setInterval(async () => {
        if(!ref) return;
        clearInterval(interval);
        const data = selectedAction.data
        App.loadUIData(ref, data)
        handlersCopy = window.handlers
        Object.freeze(handlersCopy)
        window.handlers = {}
        try {
            await actionClass?.open?.(selectedAction, window.handlers)
        } catch (e) {
            alert(`${selectedAction.type}\n${e.stack}`)
        }
    }, 10)
}} ondelete={() => {
    actions.splice(actions.indexOf(selectedAction), 1);
    BotManager.selectedBot.markAsModified(App.selectedTrigger.id)
}} {title} {html} items={actions ?? []} hideControls={!App.selectedTrigger} onadd={() => isCreatingAction = true} {itemTitle} bind:selected={selectedAction}></List>

<Modal bind:open={isCreatingAction} title="Add Action" onDone={() => addAction()}>
        <div class="grid gap-4 py-4">
           <div class="grid grid-cols-4 items-center gap-4">
               <Label for="type" class="text-right">Type</Label>
               <SearchSelect name="type" values={[{label:"None", value: "None", disabled:true}, ...(BotManager.selectedBot?.actionClasses ?? []).map(el => el.type).sort().map(el => ({label: el, value: el}))]} bind:value={actionType} class="col-span-3 w-full {actionType === 'None' ? 'ring-2 ring-destructive' : ''}"/>
           </div>
        </div>
</Modal>
<Modal bind:open={isEditingAction} title="{actions?.indexOf(selectedAction) + 1}. {selectedAction?.type}" onDone={() => editAction()}>
        <div class="grid gap-4 py-4" bind:this={ref}>
            {@html BotManager.selectedBot.actionClasses.find(t => t.type === selectedAction.type)?.html ?? ""}
        </div>
</Modal>