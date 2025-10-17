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

    function hasNestedActions(act) {
        if(!(act instanceof Action)) act = Action.fromJSON(act);
        for (const key of act.data.keys().toArray()) {
            const value = act.data.get(key);
            if (Array.isArray(value)) {
                if (value.some(el => el.isAction)) {
                    return true;
                }
                if (value.some(el => el.isCustom)) {
                    for (const customEl of value) {
                        if (hasNestedActionsInCustom(customEl)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    function hasNestedActionsInCustom(customEl) {
        if(!(customEl instanceof CustomElement)) customEl = CustomElement.fromJSON(customEl);
        for (const customKey of customEl.data.keys().toArray()) {
            const customValue = customEl.data.get(customKey);
            if (Array.isArray(customValue)) {
                if (customValue.some(el => el.isAction)) {
                    return true;
                }
                if (customValue.some(el => el.isCustom)) {
                    for (const nestedCustom of customValue) {
                        if (hasNestedActionsInCustom(nestedCustom)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
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
                            <Button variant="secondary" class="size-6 mt-auto mb-auto" title="Variables" onclick={() => Debugger.attachVariablesWindow(trigger)}><VariableIcon></VariableIcon></Button>
                            <Collapsible.Trigger class={buttonVariants({ variant: "ghost", class: "mt-auto mb-auto size-7" })}>
                                <ChevronDownIcon />
                            </Collapsible.Trigger>
                        </div>
                    {/if}
                </div>
                <Collapsible.Content>
                    {#each trigger.actions as act, i}
                        {@render action(trigger, act, `${i+1}. `, true)}
                    {/each}
                </Collapsible.Content>
            </Collapsible.Root>
        {/each}
        {#snippet action(trigger, act, prefix, canRun)}
            <Collapsible.Root>
                <div class="flex w-full text-xs bg-popover px-2 py-2 border-b-1">
                    <Checkbox bind:checked={act.isBreakPoint} onCheckedChange={(v) => v ? Debugger.markAsBreakPoint(act.id) : Debugger.removeBreakPoint(act.id)} class="mr-3 mt-auto mb-auto" title="Is Break Point?"/>
                    <label class="mt-auto mb-auto">
                        {prefix}{act.data.keys().toArray().length === 0 ? act.type : BotManager.selectedBot.actionClasses.find(a => a.type === act.type)?.title?.(act.data) ?? act.type}
                    </label>
                    <div class="ml-auto mt-auto mb-auto">
                        {#if canRun}
                            <Button class="mr-1 ml-3 size-6 mt-auto mb-auto" onclick={() => Debugger.debugAction(page.url.searchParams.get("path"), trigger.id, act.id)}><PlayIcon></PlayIcon></Button>
                        {/if}
                    </div>
                    <Collapsible.Trigger class={buttonVariants({ variant: 'ghost', class: `mt-auto mb-auto size-6 ${hasNestedActions(act) ? '' : 'hidden'}` })}
                    >
                        <ChevronDownIcon />
                    </Collapsible.Trigger>
                </div>
                <Collapsible.Content>
                    {#each act.data.keys().toArray() ?? [] as key}
                        {@const value = act.data.get(key)}
                        {#if Array.isArray(value)}
                            {#if value.some(el => el.isAction)}
                                {#each value.filter(el => el.isAction) as nestedAct, i}
                                    {@const nestedAction = Action.fromJSON(nestedAct)}
                                    {@const nestedCanRun = trigger.actionManagers.find(m => m.actions.find(a => a === nestedAction.id))}
                                    {@render action(trigger, nestedAction, `${key}: ${i+1}. `, nestedCanRun)}
                                {/each}
                            {/if}
                            {#if value.some(el => el.isCustom)}
                                {#each value.filter(el => el.isCustom).map(el => CustomElement.fromJSON(el)) as customEl, i}
                                    {@render renderCustomElement(trigger, customEl, key, i)}
                                {/each}
                            {/if}
                        {/if}
                    {/each}
                </Collapsible.Content>
            </Collapsible.Root>
        {/snippet}
        {#snippet renderCustomElement(trigger, customEl, arrayName, elementIndex)}
            {#each customEl.data.keys().toArray() as customKey}
                {@const customValue = customEl.data.get(customKey)}
                {#if Array.isArray(customValue)}
                    {#if customValue.some(el => el.isAction)}
                        {#each customValue.filter(el => el.isAction) as nestedAct, i}
                            {@const nestedAction = Action.fromJSON(nestedAct)}
                            {@const nestedCanRun = trigger.actionManagers.find(m => m.actions.find(a => a === nestedAction.id))}
                            {@render action(trigger, nestedAction, `${arrayName} ${elementIndex + 1}: ${customKey}: ${i+1}. `, nestedCanRun)}
                        {/each}
                    {/if}
                    {#if customValue.some(el => el.isCustom)}
                        {#each customValue.filter(el => el.isCustom).map(el => CustomElement.fromJSON(el)) as nestedCustomEl, i}
                            {@render renderCustomElement(trigger, nestedCustomEl, `${arrayName} ${elementIndex + 1}: ${customKey}`, i)}
                        {/each}
                    {/if}
                {/if}
            {/each}
        {/snippet}
    </div>
</ScrollArea>