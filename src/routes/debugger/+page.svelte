<script>
    import {page} from "$app/state";
    import * as Collapsible from "$lib/components/ui/collapsible/index.js";
    import {ChevronDownIcon, PlayIcon, VariableIcon} from "@lucide/svelte";
    import {Button, buttonVariants} from "$lib/components/ui/button/index.js";
    import {getCurrentWebview} from '@tauri-apps/api/webview';
    import Action from "$lib/classes/Action.svelte.js";
    import CustomElement from "$lib/classes/CustomElement.svelte.js";
    import {ScrollArea} from "$lib/components/ui/scroll-area/index.js";
    import {BotManager} from "$lib/classes/BotManager.svelte.js";
    import {Debugger} from "$lib/classes/Debugger.svelte.js";
    import {Checkbox} from "$lib/components/ui/checkbox/index.js";
    import Trigger from "$lib/classes/Trigger.svelte.js";
    const webview = getCurrentWebview()
    webview.setAutoResize(true);
    let loaded = $state([])
    webview.once("data", ({payload}) => {
        loaded = JSON.parse(payload).map(t => Trigger.fromJSON(t, true));
    })
    webview.emit("load")
    let bot = $derived(BotManager.bots.find(bot => bot.path === page.url.searchParams.get("path")));
    let triggers = $derived([...loaded, ...(bot?.triggers ?? [])].filter((t) => t.showInDebugger))
    function sortActions(trigger) {
        const { edges, actions } = trigger
        const start = actions[0]
        const queue = [start]
        const result = [start]
        const visited = new Set([start.id])

        while (queue.length) {
            const act = queue.shift()
            const connections = edges.filter(e => e.source === act.id)

            connections.forEach(connection => {
                const node = actions.find(a => a.id === connection.target)
                if (node && !visited.has(node.id)) {
                    visited.add(node.id)
                    queue.push(node)
                    result.push(node)
                }
            })
        }

        return result
    }

</script>
<ScrollArea class="h-full">
    <div class="w-full h-full flex flex-col gap-1">
        {#each triggers.filter((t,i) => triggers.findIndex(x => t.id === x.id) === i) as trigger}
            <Collapsible.Root>
                <div class="flex w-full text-sm bg-card pl-5 pr-2 py-2 border-b-1">
                    <label class="mt-auto mb-auto font-semibold">{trigger.name}</label>
                    {#if trigger.actions.length}
                        <div class="ml-auto">
                            <Button variant="secondary" class="size-6 mt-auto mb-auto" title="View Variables" onclick={() => Debugger.attachVariablesWindow(trigger)}><VariableIcon></VariableIcon></Button>
                            <Collapsible.Trigger class={buttonVariants({ variant: "ghost", class: "mt-auto mb-auto size-7" })}>
                                <ChevronDownIcon />
                            </Collapsible.Trigger>
                        </div>
                    {/if}
                </div>
                <Collapsible.Content>
                    {#each sortActions(trigger).filter(act => act.actionType && act.type !== "group") as act, i}
                        {@render action(trigger, act, trigger.actions.filter(act => act.actionType && act.type !== "group").findIndex(a => a.id === act.id) + 1)}
                    {/each}
                </Collapsible.Content>
            </Collapsible.Root>
        {/each}
        {#snippet action(trigger, act, index)}
                <div class="flex w-full text-xs bg-popover px-2 py-2 border-b-1">
                    <Checkbox bind:checked={act.isBreakPoint} onCheckedChange={(v) => v ? Debugger.markAsBreakPoint(act.id) : Debugger.removeBreakPoint(act.id)} class="mr-3 mt-auto mb-auto" title="Is Break Point?"/>
                    <label class="mt-auto mb-auto">
                        {index}. {act.actionType}
                    </label>
                    <div class="ml-auto mt-auto mb-auto">
                        <Button class="mr-1 ml-3 size-6 mt-auto mb-auto" onclick={() => Debugger.debugAction(page.url.searchParams.get("path"), trigger.id, act.id)} title="Run Action"><PlayIcon></PlayIcon></Button>
                    </div>
                </div>
        {/snippet}
    </div>
</ScrollArea>