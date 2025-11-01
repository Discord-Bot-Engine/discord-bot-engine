<script>
    import { Handle, Position } from '@xyflow/svelte';
    import {App} from "$lib/classes/App.svelte.js"
    import {BotManager} from "$lib/classes/BotManager.svelte.js";
    import ErrorIcon from "$lib/components/ErrorIcon.svelte";
    let { id, selected, ...other } = $props();
    const action = $derived(App.selectedTrigger.actions.find(act => act.id === id));
    const actionType = $derived(action.actionType)
</script>

<div class="bg-muted rounded-lg text-xs pb-1 min-w-20">
        <label class="p-3 py-1 rounded-t-lg block w-full text-center {selected ? 'bg-primary' : 'bg-secondary'}" ondblclick={() => {
            if(actionType) App.openAction()
        }}>{actionType ? `${App.selectedTrigger.actions.filter(act => act.type === "action").findIndex(act => act.id === id)}. ${actionType}` : "root"}
            {#if !BotManager.selectedBot.actionClasses.find(a => a.type === actionType) && actionType}
                <ErrorIcon class="!w-4 !h-4" />
            {/if}
        </label>
    {#if actionType}
    <div class="flex flex-col gap- mt-1 h-fit w-full">
                    <div class="flex !text-xs justify-start">
                        <Handle
                                type="target"
                                position={Position.Left}
                                class="!relative mt-[8px] p-1 !bg-primary !border-0"
                        /> action
                    </div>
                </div>
    {/if}
            <div class="flex flex-col gap-1 mt-1 h-fit w-full">
                {#each action.outputs ?? BotManager.selectedBot.actionClasses.find(act => act.actionType === actionType)?.outputs ?? ["action"] as op}
                    <div class="flex !text-xs justify-end">
                        <label class="pl-2 pr-0">{op}</label><Handle
                            id={op}
                            type="source"
                            position={Position.Right}
                            class="!relative mt-[8px] p-1 !bg-primary !border-0"
                    />
                    </div>
                {/each}
            </div>
</div>