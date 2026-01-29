<script>
    import { v4 as uuidv4 } from "uuid";
    import List from '$lib/components/List.svelte';
    import * as Card from '$lib/components/ui/card/index.js';
    import { useSvelteFlow, useNodes } from '@xyflow/svelte';
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
    import Translation from "$lib/components/Translation.svelte";
    import {onMount} from "svelte";
    let actionType = $state("None")
    let isCreatingAction = $state(false);
    let open = $state(false)
    const { getViewport } = useSvelteFlow();
    const nodes = useNodes();
    let pos = {x: 0, y: 0}
    let selectedTrigger = $derived(App.selectedTrigger ?? new Trigger())
    function addAction() {
        App.updateUndo()
        if(actionType.toLowerCase() === "none") return;
        const id = uuidv4()
        const viewport = getViewport()
        const act = new Action(id, actionType, (-viewport.x + pos.x) / viewport.zoom, (-viewport.y + pos.y) / viewport.zoom)
        App.selectedTrigger.actions = [...App.selectedTrigger.actions, act]
        isCreatingAction = false;
    }
   async function editAction() {
       App.updateUndo()
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
   function bindings(ev) {
       if(document.activeElement.tagName !== "BODY" && !document.activeElement.className.startsWith("svelte-flow") || getSelection().toString()) return;
       ev.preventDefault();
       if(ev.key === "c" && ev.ctrlKey && App.selectedTrigger) copy()
       else if(ev.key === "v" && ev.ctrlKey && App.selectedTrigger) paste()
       else if(ev.key === "d" && ev.ctrlKey && App.selectedTrigger) {
           const actions = localStorage.getItem("copiedActions");
           const edges = localStorage.getItem("copiedEdges");
           copy()
           paste()
           localStorage.setItem("copiedActions", actions)
           localStorage.setItem("copiedEdges", edges)
       }
       else if(ev.key === "a" && ev.ctrlKey && App.selectedTrigger) {
           nodes.update(nodes => nodes.map(n => ({...n, selected: true})))
       } else if(ev.key === "z" && ev.ctrlKey && App.selectedTrigger) {
           if(!BotManager.selectedBot.undos.length) return;
           BotManager.selectedBot.markAsModified(App.selectedTrigger.id)
           const state = JSON.parse(BotManager.selectedBot.undos.pop())
           const newActions = []
           App.selectedTrigger.actions.forEach(action => {
               const data = {}
               action.data.keys().forEach(key => {
                   data[key] = action.data.get(key)
               })
               newActions.push({...action, data})
           })
           BotManager.selectedBot.redos.push(JSON.stringify({actions: newActions, edges: App.selectedTrigger.edges}))
           BotManager.selectedBot.redos = BotManager.selectedBot.redos.filter((s,i) => BotManager.selectedBot.redos.indexOf(s) === i);
           if(BotManager.selectedBot.redos.length > 100) BotManager.selectedBot.redos.shift()
           App.selectedTrigger.actions = state.actions.map(act => Action.fromJSON(act))
           App.selectedTrigger.edges = state.edges
       } else if(ev.key === "y" && ev.ctrlKey && App.selectedTrigger) {
           if(!BotManager.selectedBot.redos.length) return;
           BotManager.selectedBot.markAsModified(App.selectedTrigger.id)
           const state = JSON.parse(BotManager.selectedBot.redos.pop())
           const newActions = []
           App.selectedTrigger.actions.forEach(action => {
               const data = {}
               action.data.keys().forEach(key => {
                   data[key] = action.data.get(key)
               })
               newActions.push({...action, data})
           })
           BotManager.selectedBot.undos.push(JSON.stringify({actions: newActions, edges: App.selectedTrigger.edges}))
           BotManager.selectedBot.undos = BotManager.selectedBot.undos.filter((s,i) => BotManager.selectedBot.undos.indexOf(s) === i);
           if(BotManager.selectedBot.undos.length > 100) BotManager.selectedBot.undos.shift()
           App.selectedTrigger.actions = state.actions.map(act => Action.fromJSON(act))
           App.selectedTrigger.edges = state.edges
       }  else if(ev.key === "s" && ev.ctrlKey) {
           BotManager.saveBotData()
       }
   }
   function copy() {
       const actions = App.selectedTrigger?.actions.filter(act => act.selected && act.actionType)
       const newActions = []
       actions.forEach(action => {
           const data = {}
           action.data.keys().forEach(key => {
               data[key] = action.data.get(key)
           })
           newActions.push({...action, data})
       })
       const edges = App.selectedTrigger?.edges.filter(edge => actions.find(act => act.id === edge.source || act.id === edge.target))
       localStorage.setItem("copiedActions", JSON.stringify(newActions));
       localStorage.setItem("copiedEdges", JSON.stringify(edges));
   }
    function paste() {
        App.updateUndo();
        let actions = localStorage.getItem("copiedActions");
        let edges = localStorage.getItem("copiedEdges");
        if (!actions || !edges) return;
        actions = JSON.parse(actions);
        edges = JSON.parse(edges);
        const newActions = [];
        const newEdges = [];
        const idMap = {};
        actions.forEach(act => {
            const newAct = Action.fromJSON(act);
            const newId = uuidv4();
            idMap[act.id] = newId;
            newAct.id = newId;
            newActions.push(newAct);
        });
        edges.forEach(edge => {
            const newEdge = { ...edge };
            if (idMap[newEdge.source]) {
                newEdge.source = idMap[newEdge.source];
            }
            if (idMap[newEdge.target]) {
                newEdge.target = idMap[newEdge.target];
            }
            newEdge.id = uuidv4();

            newEdges.push(newEdge);
        });

        App.selectedTrigger.actions = [
            ...App.selectedTrigger.actions,
            ...newActions
        ];

        App.selectedTrigger.edges = [
            ...App.selectedTrigger.edges,
            ...newEdges
        ];
    }

    function deleteActions() {
       const list = App.selectedTrigger.actions.filter(act => act.selected)
       App.selectedTrigger.actions = App.selectedTrigger.actions.filter(act => !act.actionType || !list.find(n => n.id === act.id))
       App.selectedTrigger.edges = App.selectedTrigger.edges.filter(edge => App.selectedTrigger.actions.find(n => n.id === edge.source) && App.selectedTrigger.actions.find(n => n.id === edge.target))
    }
</script>
<svelte:window onkeydown={bindings}></svelte:window>
<Card.Root class="w-full h-full min-h-40 p-1 pt-0 px-0 pb-0 border-0 relative rounded-none shadow-none">
    <Card.Content class="p-1 pt-0 px-0 pb-0 h-full overflow-hidden border-0">
            <div class="flex h-fit pr-0 px-1.5 py-0.5 font-bold border-1">
                <label class="mr-auto text-md overflow-hidden text-ellipsis "><Translation text="Actions"/></label>
                <Button variant="ghost" size="icon" class="!p-1 !w-fit !h-fit !bg-transparent !cursor-pointer {!App.selectedTrigger ? 'hidden' : ''}" onclick={() => {isCreatingAction = true; pos = {x: 0, y: 0}}}><PlusIcon /></Button>
                <Button variant="ghost" size="icon" class="!p-1 !w-fit !h-fit !bg-transparent !cursor-pointer {!App.selectedTrigger ? 'hidden' : ''}" onclick={() => deleteActions()}
                ><MinusIcon /></Button>
            </div>
        <div class="bg-muted h-full w-full">
            {#if App.selectedTrigger}
                    <SvelteFlow onbeforedelete={() => {
                    BotManager.selectedBot.markAsModified(App.selectedTrigger.id)
                    if(document.activeElement.tagName !== "BODY" && !document.activeElement.getAttribute("class").startsWith("svelte-flow") || getSelection().toString()) return false;
                    else {
                        App.updateUndo()
                        return true
                    }
                }} bind:this={App.svelteFlow} oncontextmenu={(ev) => {
                    ev.preventDefault()
                    isCreatingAction = true;
                    let offset = 300
                    if(App.hideTriggers)
                        offset = 150
                    pos = {x: ev.pageX - offset, y: ev.pageY - 75}
                }} onnodedragstart={() => App.updateUndo()} onconnectstart={() => App.updateUndo()} proOptions={{ hideAttribution: true }} colorMode="dark" edgeTypes={{default: Edge}} nodeTypes={{action: Node, group: Group}} bind:nodes={selectedTrigger.actions} bind:edges={selectedTrigger.edges} >
                        <Background bgColor="transparent"></Background>
                    </SvelteFlow>
            {/if}
        </div>
    </Card.Content>
</Card.Root>
<Modal bind:open={isCreatingAction} title="Add Action" onDone={() => addAction()}>
        <div class="grid gap-4 py-4 px-1">
           <div class="grid grid-cols-4 items-center gap-4">
               <Label for="type" class="text-right"><Translation text="Type"/></Label>
               {#await Promise.all((BotManager.selectedBot?.actionClasses ?? []).map(el => el.type).sort().map(async el => ({label: await App.translate(el, App.selectedLanguage), value: el}))) then actions}
                   {#await App.translate("Group", App.selectedLanguage) then group}
                       {#await App.translate("None", App.selectedLanguage) then none}
                <SearchSelect name="type" values={[{label:none, value: "None", disabled:true}, {label: group, value:"group"}, ...actions]} bind:value={actionType} class="col-span-3 w-full {actionType === 'None' ? 'ring-2 ring-destructive' : ''}"/>
                       {/await}
                   {/await}
               {/await}
           </div>
        </div>
</Modal>
<Modal bind:open={App.isEditingAction} title="{App.selectedTrigger?.actions?.filter(act => act.type !== 'group').findIndex(act => act.id === App.selectedAction?.id)}. {App.selectedAction?.actionType}" onDone={() => editAction()} url="https://discord-bot-engine.gitbook.io/discord-bot-engine/actions/{App.selectedAction?.actionType.toLowerCase().replaceAll(' ', '-')}">
        <div class="grid gap-4 py-4 px-1 w-full" bind:this={App.ref}>
            {@html BotManager.selectedBot.actionClasses.find(t => t.type === App.selectedAction.actionType)?.html ?? ""}
        </div>
</Modal>