<script>
    import {App} from "$lib/classes/App.svelte.js";
    import {page} from "$app/state";
    import * as Collapsible from "$lib/components/ui/collapsible/index.js";
    import {ChevronDownIcon } from "@lucide/svelte";
    import { buttonVariants} from "$lib/components/ui/button/index.js";
    import { getCurrentWebview } from '@tauri-apps/api/webview';
    import {ScrollArea} from "$lib/components/ui/scroll-area/index.js";
    import {BotManager} from "$lib/classes/BotManager.svelte.js";
    import {SvelteMap} from "svelte/reactivity";
    const webview = getCurrentWebview()
    webview.setAutoResize(true);
    let loaded = new SvelteMap()
    webview.once("data", ({payload}) => {
        const data = JSON.parse(payload)
        Object.keys(data).forEach(key => {
          loaded.set(key, data[key])
        })
    })
    webview.emit("load")
    const bot = $derived(BotManager.bots.find(bot => bot.path === page.url.searchParams.get("path")))
    const trigger = $derived(bot?.triggers.find(t => t.id === page.url.searchParams.get("trigger")))
    const variables = $derived(trigger?.variables);
    const debugVariables = $derived.by(() => {
        let map = new Map();
        loaded.keys().forEach(key => {
            map.set(key, loaded.get(key))
        })
        trigger?.debugVariables.keys().forEach(key => {
            map.set(key, trigger.debugVariables.get(key))
        })
        return map;
    });
</script>
<ScrollArea class="h-full">
    <div class="w-full h-full flex flex-col gap-1">
        {#each variables?.keys() ?? [] as name}
            <Collapsible.Root>
                <div class="flex w-full text-sm bg-card pl-5 pr-2 py-1 border-b-1">
                    <div class="flex gap-7 w-full">
                        <label class="mt-auto mb-auto w-full font-semibold">{name}</label>
                        {#if typeof debugVariables.get(name) !== "object" || debugVariables.get(name) == null}
                            <label class="mt-auto mb-auto w-full overflow-hidden text-ellipsis">{debugVariables.get(name) ?? String(debugVariables.get(name))}</label>
                        {/if}
                    </div>
                    <Collapsible.Trigger class={buttonVariants({ variant: "ghost", class: `size-7 ml-auto ${typeof debugVariables.get(name) === "object" && debugVariables.get(name) != null ? "" : "hidden"}` })}
                    >
                        <ChevronDownIcon />
                    </Collapsible.Trigger>
                </div>
                <Collapsible.Content>
                    {#if typeof debugVariables.get(name) === "object" && debugVariables.get(name) != null}
                        {#each Object.keys(debugVariables.get(name)) as key}
                            {@render variable(key, debugVariables.get(name), "")}
                        {/each}
                    {/if}
                </Collapsible.Content>
            </Collapsible.Root>
        {/each}
    </div>
    {#snippet variable(name, parent, prefix)}
        <Collapsible.Root>
            <div class="flex w-full text-xs bg-card pl-5 pr-2 py-1 border-b-1">
                <div class="flex gap-7 w-full">
                    <label class="mt-auto mb-auto w-full">{prefix}{name}</label>
                    {#if typeof parent[name] !== "object" || parent[name] == null}
                        <label class="mt-auto mb-auto w-full overflow-hidden text-ellipsis">{parent[name] ?? String(parent[name])}</label>
                    {/if}
                </div>
                <Collapsible.Trigger class={buttonVariants({ variant: "ghost", class: `size-5 ml-auto ${typeof parent[name] === "object" && parent[name] != null ? "" : "hidden"}` })}
                >
                    <ChevronDownIcon />
                </Collapsible.Trigger>
            </div>
            <Collapsible.Content>
                {#if typeof parent[name] === "object" && parent[name] != null}
                    {#each Object.keys(parent[name]).slice(0, 100) as key}
                        {@render variable(key, parent[name], `${name}.`)}
                    {/each}
                {/if}
            </Collapsible.Content>
        </Collapsible.Root>
    {/snippet}
</ScrollArea>