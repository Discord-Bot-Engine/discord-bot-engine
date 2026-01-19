<script>
    import * as Card from '$lib/components/ui/card/index.js';
    import {SquareIcon, PlayIcon, ChevronUpIcon, ChevronDownIcon} from "@lucide/svelte";
    import {ScrollArea} from "$lib/components/ui/scroll-area/index.js";
    import {Button} from "$lib/components/ui/button/index.js";
    import {BotManager} from "$lib/classes/BotManager.svelte.js";
    import {App} from "$lib/classes/App.svelte.js";
    import Translation from "$lib/components/Translation.svelte";
</script>
<div class="flex flex-col bg-card rounded-none shadow-sm">
    <Button variant="ghost" class="w-full rounded-none border-1 border-t-0 h-fit !p-0" onclick={() => App.hideConsole = !App.hideConsole}>
        {#if !App.hideConsole}
            <ChevronDownIcon/>
        {:else}
            <ChevronUpIcon/>
        {/if}
    </Button>
    {#if !App.hideConsole}
<Card.Root class="!rounded-none border-t-0 w-full h-full min-h-50 p-1 relative shadow-none">
    <Card.Content class="p-1 px-1 overflow-hidden h-full">
        <div class="flex justify-end h-fit font-bold">
            <label class="mr-auto text-md"><Translation text="Console"/></label>
            <Button variant={BotManager.selectedBot?.isRunning ? undefined : 'secondary'} size="icon" class="size-8 -mt-1 rounded-lg rounded-r-none" onclick={() => BotManager.runBot()}><PlayIcon size={16} /></Button>
            <Button variant={BotManager.selectedBot?.isRunning ? 'secondary' : undefined} size="icon" class="size-8 -mt-1 rounded-lg rounded-l-none" onclick={() => BotManager.stopBot()}><SquareIcon size={16} /></Button>
        </div>
        <ScrollArea class="text-sm h-[25vh]">
            <pre class="whitespace-pre-wrap">{BotManager.selectedBot?.stdout}</pre>
        </ScrollArea>
    </Card.Content>
</Card.Root>
        {/if}
</div>