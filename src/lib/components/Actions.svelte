<script>
    import { v4 as uuidv4 } from "uuid";
    import List from '$lib/components/List.svelte';
    import * as Card from '$lib/components/ui/card/index.js';
    import { useSvelteFlow } from '@xyflow/svelte';
    import { App } from '$lib/classes/App.svelte.js';
    import {Label} from "$lib/components/ui/label/index.js";
    import Action from "$lib/classes/Action.svelte.js";
    import Modal from "$lib/components/Modal.svelte";
    import SearchSelect from "$lib/components/SearchSelect.svelte";
    import {BotManager} from "$lib/classes/BotManager.svelte.js";
    import ErrorIcon from "$lib/components/ErrorIcon.svelte";
    import {SvelteFlow} from "@xyflow/svelte";
    import {Button} from "$lib/components/ui/button/index.js";
    import {MinusIcon, PlusIcon} from "@lucide/svelte";
    import {Background} from "@xyflow/svelte";
    import '@xyflow/svelte/dist/style.css';
    import Node from "$lib/components/Node.svelte";
    import Edge from "$lib/components/Edge.svelte";
    import Group from "$lib/components/Group.svelte";
    let actionType = $state("None")
    let isCreatingAction = $state(false);
    let open = $state(false)
    const { getViewport } = useSvelteFlow();
    function addAction() {
        if(actionType.toLowerCase() === "none") return;
        const id = uuidv4()
        const viewport = getViewport()
        const act = new Action(id, actionType, -viewport.x, -viewport.y)
        App.selectedTrigger.actions = [...App.selectedTrigger.actions, act]
        isCreatingAction = false;
    }
   async function editAction() {
       const actionClass = BotManager.selectedBot.actionClasses.find(act => act.type === App.selectedAction.actionType);
        Object.keys(App.handlersCopy).forEach(handler => {
            window.handlers[handler] = App.handlersCopy[handler];
        })
        App.handlersCopy = window.handlers
        const data = App.selectedAction.data
        App.saveUIData(App.ref, data)
        App.isEditingAction = false
        try {
            await actionClass?.close?.(App.selectedAction)
        } catch (e) {
            alert(`${App.selectedAction.type}\n${e.stack}`)
        }
   }
</script>
<Card.Root class="w-full h-full min-h-40 p-1 px-0 pb-0 relative">
    <Card.Content class="p-1 px-0 pb-0 h-full overflow-hidden">
        <div class="flex h-fit px-2">
            <label class="mr-auto opacity-50 text-sm overflow-hidden text-ellipsis">Actions</label>
            <Button variant="ghost" size="icon" class="size-6 {!App.selectedTrigger ? 'hidden' : ''}" onclick={() => isCreatingAction = true}><PlusIcon /></Button>
            <Button variant="ghost" size="icon" class="size-6 {!App.selectedTrigger ? 'hidden' : ''}" onclick={() => {
                const list = App.selectedTrigger.actions.filter(act => act.selected)
                App.selectedTrigger.actions = App.selectedTrigger.actions.filter(act => !act.actionType || !list.find(n => n.id === act.id))
                App.selectedTrigger.edges = App.selectedTrigger.edges.filter(edge => App.selectedTrigger.actions.find(n => n.id === edge.source) && App.selectedTrigger.actions.find(n => n.id === edge.target))
            }
    }><MinusIcon /></Button>
        </div>
            {#if App.selectedTrigger}
                <SvelteFlow proOptions={{ hideAttribution: true }} colorMode="dark" edgeTypes={{default: Edge}} nodeTypes={{action: Node, group: Group}} bind:nodes={App.selectedTrigger.actions} bind:edges={App.selectedTrigger.edges} >
                    <Background bgColor="oklch(0.27 0.03 259.08)"></Background>
                </SvelteFlow>
            {/if}
    </Card.Content>
</Card.Root>
<Modal bind:open={isCreatingAction} title="Add Action" onDone={() => addAction()}>
        <div class="grid gap-4 py-4">
           <div class="grid grid-cols-4 items-center gap-4">
               <Label for="type" class="text-right">Type</Label>
               <SearchSelect name="type" values={[{label:"None", value: "None", disabled:true}, {label:"Group", value:"group"}, ...(BotManager.selectedBot?.actionClasses ?? []).map(el => el.type).sort().map(el => ({label: el, value: el}))]} bind:value={actionType} class="col-span-3 w-full {actionType === 'None' ? 'ring-2 ring-destructive' : ''}"/>
           </div>
        </div>
</Modal>
<Modal bind:open={App.isEditingAction} title="{App.selectedTrigger?.actions?.filter(act => act.type !== 'group').findIndex(act => act.id === App.selectedAction?.id)}. {App.selectedAction?.actionType}" onDone={() => editAction()}>
        <div class="grid gap-4 py-4" bind:this={App.ref}>
            {@html BotManager.selectedBot.actionClasses.find(t => t.type === App.selectedAction.actionType)?.html ?? ""}
        </div>
</Modal>