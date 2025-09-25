<script>
    import {page} from "$app/state";
    import * as Collapsible from "$lib/components/ui/collapsible/index.js";
    import {ChevronDownIcon, PlayIcon} from "@lucide/svelte";
    import {Button, buttonVariants} from "$lib/components/ui/button/index.js";
    import {getCurrentWebview} from '@tauri-apps/api/webview';
    import Action from "$lib/classes/Action.svelte.js";
    import {ScrollArea} from "$lib/components/ui/scroll-area/index.js";
    import Trigger from "$lib/classes/Trigger.svelte.js";
    import {BotManager} from "$lib/classes/BotManager.svelte.js";
    import {Debugger} from "$lib/classes/Debugger.svelte.js";
    getCurrentWebview().setAutoResize(true);
    let bot = $derived(BotManager.bots.find(bot => bot.path === page.url.searchParams.get("path")));
    let init = false
    $effect(() => {
        if(bot && !init) {
            init = true;
            bot.debugTriggers = JSON.parse(decodeURIComponent(page.url.searchParams.get("debugTriggers"))).map(t => Trigger.fromJSON(t))
        }
    })
</script>
<ScrollArea class="h-full">
<div class="w-full h-full flex flex-col gap-1">
    {#each bot?.debugTriggers ?? [] as trigger}
        <Collapsible.Root>
            <div class="flex w-full text-sm bg-card pl-5 pr-2 py-1 border-b-1">
                <label class="mt-auto mb-auto font-semibold">{trigger.name}</label>
                {#if trigger.actions.length}
                    <Collapsible.Trigger class={buttonVariants({ variant: "ghost", class: "size-7 ml-auto" })}>
                        <ChevronDownIcon />
                    </Collapsible.Trigger>
                {/if}
            </div>
            <Collapsible.Content>
                {#each trigger.actions as act}
                    {@render action(trigger, act, "")}
                {/each}
            </Collapsible.Content>
        </Collapsible.Root>
    {/each}
    {#snippet action(trigger, act, prefix)}
        <Collapsible.Root>
            <div class="flex w-full text-xs bg-popover pl-5 pr-2 py-1 border-b-1">
                <label class="mt-auto mb-auto">{prefix}{act.data.keys().toArray().length === 0 ? act.type : BotManager.selectedBot.actionClasses.find(a => a.type === act.type)?.title?.(act.data) ?? act.type}</label>
                <Button class="ml-auto mr-1 size-6 mt-auto mb-auto" onclick={() => Debugger.debugAction(page.url.searchParams.get("path"), trigger.id, act.id)}><PlayIcon></PlayIcon></Button>
                <Collapsible.Trigger class={buttonVariants({ variant: 'ghost', class: `size-5 ${act.data.keys().toArray().some(key=>Array.isArray(act.data.get(key)) && act.data.get(key).every(el => el.isAction)) ? '' : 'hidden'}` })}
                >
                    <ChevronDownIcon />
                </Collapsible.Trigger>
            </div>
            <Collapsible.Content>
                {#each act.data.keys().toArray() ?? [] as key}
                    {#if Array.isArray(act.data.get(key)) && act.data.get(key).every(el => el.isAction)}
                        {#each act.data.get(key) as act}
                            {@render action(trigger, Action.fromJSON(act), `${key}: `)}
                        {/each}
                    {/if}
                {/each}
            </Collapsible.Content>
        </Collapsible.Root>
    {/snippet}
</div>
</ScrollArea>