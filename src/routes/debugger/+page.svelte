<script>
    import {page} from "$app/state";
    import * as Collapsible from "$lib/components/ui/collapsible/index.js";
    import {ChevronDownIcon, PlayIcon, VariableIcon} from "@lucide/svelte";
    import {Button, buttonVariants} from "$lib/components/ui/button/index.js";
    import {getCurrentWebview} from '@tauri-apps/api/webview';
    import Action from "$lib/classes/Action.svelte.js";
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
    let triggers = $derived([...loaded, ...(bot?.triggers ?? [])].filter((t) => t.showInDebug))
</script>
<ScrollArea class="h-full">
<div class="w-full h-full flex flex-col gap-1">
    {#each triggers.filter((t,i) => triggers.findIndex(x => t.id === x.id) === i) as trigger}
        <Collapsible.Root>
            <div class="flex w-full text-sm bg-card pl-5 pr-2 py-1 border-b-1">
                <label class="mt-auto mb-auto font-semibold">{trigger.name}</label>
                {#if trigger.actions.length}
                    <div class="ml-auto">
                    <Button variant="secondary" class="size-6 mt-auto mb-auto" title="Variables" onclick={() => Debugger.attachVariablesWindow(trigger)}><VariableIcon></VariableIcon></Button>
                    <Collapsible.Trigger class={buttonVariants({ variant: "ghost", class: "size-7" })}>
                        <ChevronDownIcon />
                    </Collapsible.Trigger>
                    </div>
                {/if}
            </div>
            <Collapsible.Content>
                {#each trigger.actions as act}
                    {@render action(trigger, act, "", true)}
                {/each}
            </Collapsible.Content>
        </Collapsible.Root>
    {/each}
    {#snippet action(trigger, act, prefix, canRun)}
        <Collapsible.Root>
            <div class="flex w-full text-xs bg-popover px-2 py-1 border-b-1">
                <Checkbox bind:checked={act.isBreakPoint} onCheckedChange={(v) => v ? Debugger.markAsBreakPoint(act.id) : Debugger.removeBreakPoint(act.id)} class="mr-3 mt-auto mb-auto" title="Is Break Point?"/>
                <label class="mt-auto mb-auto">
                    {prefix}{act.data.keys().toArray().length === 0 ? act.type : BotManager.selectedBot.actionClasses.find(a => a.type === act.type)?.title?.(act.data) ?? act.type}</label>
                <div class="ml-auto">
                {#if canRun}
                    <Button class="mr-1 size-6 mt-auto mb-auto" onclick={() => Debugger.debugAction(page.url.searchParams.get("path"), trigger.id, act.id)}><PlayIcon></PlayIcon></Button>
                {/if}
                </div>
                <Collapsible.Trigger class={buttonVariants({ variant: 'ghost', class: `size-5 ${act.data.keys().toArray().some(key=>Array.isArray(act.data.get(key)) && act.data.get(key).every(el => el.isAction)) ? '' : 'hidden'}` })}
                >
                    <ChevronDownIcon />
                </Collapsible.Trigger>
            </div>
            <Collapsible.Content>
                {#each act.data.keys().toArray() ?? [] as key}
                    {#if Array.isArray(act.data.get(key)) && act.data.get(key).every(el => el.isAction)}
                        {#each act.data.get(key) as act, i}
                            {@render action(trigger, Action.fromJSON(act), `${key}: `, trigger.actionManagers.find(m => m.actions.find(a => a === act.id)))}
                        {/each}
                    {/if}
                {/each}
            </Collapsible.Content>
        </Collapsible.Root>
    {/snippet}
</div>
</ScrollArea>