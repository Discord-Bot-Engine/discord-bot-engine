<script>
    import { v4 as uuidv4 } from "uuid";
    import List from '$lib/components/List.svelte';
    import { App } from '$lib/classes/App.svelte.js';
    import {Label} from "$lib/components/ui/label/index.js";
    import Action from "$lib/classes/Action.svelte.js";
    import Modal from "$lib/components/Modal.svelte";
    import CustomElement from "$lib/classes/CustomElement.svelte.js";
    import SearchSelect from "$lib/components/SearchSelect.svelte";
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
        isCreatingAction = false;
    }
    function editAction() {
        Object.keys(handlersCopy).forEach(handler => {
            window.handlers[handler] = handlersCopy[handler];
        })
        handlersCopy = window.handlers
        const data = selectedAction.data
        App.saveUIData(ref, data)
        isEditingAction = false
    }
</script>
<List ondblclick={(item) => {
    isEditingAction = true;
    let interval = setInterval(() => {
        if(!ref) return;
        clearInterval(interval);
        const data = selectedAction.data
        App.loadUIData(ref, data)
        handlersCopy = window.handlers
        Object.freeze(handlersCopy)
        window.handlers = {}
        App.selectedBot.actionClasses.find(act => act.type === selectedAction.type)?.open?.(selectedAction, window.handlers)
    }, 10)
}} ondelete={() => {
    actions.splice(actions.indexOf(selectedAction), 1);
}} {title} items={actions ?? []} hideControls={!App.selectedTrigger} onadd={() => isCreatingAction = true} itemTitle={(item, i) => i + 1 + ". "+ (item.data.keys().toArray().length === 0 ? item.type : App.selectedBot.actionClasses.find(a => a.type === item.type)?.title?.(item.data) ?? item.type)} bind:selected={selectedAction}></List>

<Modal bind:open={isCreatingAction} title="Add Action" onDone={() => addAction()}>
        <div class="grid gap-4 py-4">
           <div class="grid grid-cols-4 items-center gap-4">
               <Label for="type" class="text-right">Type</Label>
               <SearchSelect name="type" values={[{label:"None", value: "None", disabled:true}, ...(App.selectedBot?.actionClasses ?? []).map(el => el.type).sort().map(el => ({label: el, value: el}))]} bind:value={actionType} class="col-span-3 w-full {actionType === 'None' ? 'ring-2 ring-destructive' : ''}"/>
           </div>
        </div>
</Modal>
<Modal bind:open={isEditingAction} title="{actions?.indexOf(selectedAction) + 1}. {selectedAction?.type}" onDone={() => editAction()}>
        <div class="grid gap-4 py-4" bind:this={ref}>
            {@html App.selectedBot.actionClasses.find(t => t.type === selectedAction.type)?.html ?? ""}
        </div>
</Modal>