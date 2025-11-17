<script>
    import { Handle, Position } from '@xyflow/svelte';
    import {App} from "$lib/classes/App.svelte.js"
    import {BotManager} from "$lib/classes/BotManager.svelte.js";
    import ErrorIcon from "$lib/components/ErrorIcon.svelte";
    import Translation from "$lib/components/Translation.svelte";
    let { id, selected, ...other } = $props();
    const action = $derived(App.selectedTrigger.actions.find(act => act.id === id));
    const actionType = $derived(action.actionType)
</script>

<div class="bg-muted rounded-lg text-xs pb-1 min-w-20">
        <label class="p-3 py-1 rounded-t-lg block w-full text-center {selected ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}" ondblclick={() => {
            if(actionType) App.openAction()
        }}>
            {#if actionType}
                {App.selectedTrigger.actions.filter(act => act.type === "action").findIndex(act => act.id === id)}. {actionType}
            {:else}
                <Translation text={"root"}/>
            {/if}
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
                        /> <Translation text="action"/>
                    </div>
                </div>
    {/if}
            <div class="flex flex-col gap-1 mt-1 h-fit w-full">
                {#each action.outputs ?? BotManager.selectedBot.actionClasses.find(act => act.type === actionType)?.outputs ?? ["action"] as op}
                    <div class="flex !text-xs justify-end">
                        <label class="pl-2 pr-0">
                            {#if op.translation}
                                {op.translation}
                            {:else}
                                <Translation text={op}/>
                            {/if}
                        </label><Handle
                            id={op}
                            type="source"
                            position={Position.Right}
                            class="!relative mt-[8px] p-1 !bg-primary !border-0"
                    />
                    </div>
                {/each}
            </div>
</div>