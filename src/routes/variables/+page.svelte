<script>
	import {App} from "$lib/classes/App.svelte.js";
    import {page} from "$app/state";
    import * as Collapsible from "$lib/components/ui/collapsible/index.js";
    import {ChevronDownIcon } from "@lucide/svelte";
    import { buttonVariants} from "$lib/components/ui/button/index.js";
    import { getCurrentWebview } from '@tauri-apps/api/webview';
    import {ScrollArea} from "$lib/components/ui/scroll-area/index.js";
    getCurrentWebview().setAutoResize(true);
    const bot = $derived(BotManager.bots.find(bot => bot.path === page.url.searchParams.get("path")))
    const trigger = $derived(bot?.debugTrigger)
    const variables = $derived(bot?.triggers.find(t => t.name === trigger?.name && t.type === trigger?.type)?.variables);
</script>
<ScrollArea class="h-full">
<div class="w-full h-full flex flex-col gap-1">
    {#each variables?.keys() ?? [] as name}
        <Collapsible.Root>
            <div class="flex w-full text-sm bg-card pl-5 pr-2 py-1 border-b-1">
                <div class="grid grid-cols-2 w-full">
                    <label class="col-span-1 mt-auto mb-auto w-full font-semibold overflow-hidden text-ellipsis">{name}</label>
                    {#if typeof trigger.debugVariables.get(name) !== "object" || trigger.debugVariables.get(name) == null}
                        <label class="col-span-1 mt-auto mb-auto w-full overflow-hidden text-ellipsis">{trigger.debugVariables.get(name) ?? String(trigger.debugVariables.get(name))}</label>
                    {/if}
                </div>
                <Collapsible.Trigger class={buttonVariants({ variant: "ghost", class: `size-7 ml-auto ${typeof trigger.debugVariables.get(name) === "object" && trigger.debugVariables.get(name) != null ? "" : "hidden"}` })}
                >
                    <ChevronDownIcon />
                </Collapsible.Trigger>
            </div>
            <Collapsible.Content>
                {#if typeof trigger.debugVariables.get(name) === "object" && trigger.debugVariables.get(name) != null}
                    {#each Object.keys(trigger.debugVariables.get(name)) as key}
                        {@render variable(key, trigger.debugVariables.get(name), "")}
                    {/each}
                {/if}
            </Collapsible.Content>
        </Collapsible.Root>
    {/each}
</div>
    {#snippet variable(name, parent, prefix)}
        <Collapsible.Root>
            <div class="flex w-full text-xs bg-card pl-5 pr-2 py-1 border-b-1">
                <div class="grid grid-cols-2 w-full">
                    <label class="col-span-1 mt-auto mb-auto w-full overflow-hidden text-ellipsis">{prefix}{name}</label>
                    {#if typeof parent[name] !== "object" || parent[name] == null}
                        <label class="col-span-1 mt-auto mb-auto w-full overflow-hidden text-ellipsis">{parent[name] ?? String(parent[name])}</label>
                    {/if}
                </div>
                <Collapsible.Trigger class={buttonVariants({ variant: "ghost", class: `size-5 ml-auto ${typeof parent[name] === "object" && parent[name] != null ? "" : "hidden"}` })}
                >
                    <ChevronDownIcon />
                </Collapsible.Trigger>
            </div>
            <Collapsible.Content>
                {#if typeof parent[name] === "object" && parent[name] != null}
                    {#each Object.keys(parent[name]) as key}
                        {@render variable(key, parent[name], `${name}.`)}
                    {/each}
                {/if}
            </Collapsible.Content>
        </Collapsible.Root>
    {/snippet}
</ScrollArea>