<script>
    import '@fontsource-variable/jetbrains-mono';
    import * as Card from '$lib/components/ui/card/index.js';
    import {SquareIcon, PlayIcon, ChevronUpIcon, ChevronDownIcon} from "@lucide/svelte";
    import {ScrollArea} from "$lib/components/ui/scroll-area/index.js";
    import {Button} from "$lib/components/ui/button/index.js";
    import {BotManager} from "$lib/classes/BotManager.svelte.js";
    import {App} from "$lib/classes/App.svelte.js";
</script>
<div class="flex flex-col bg-card rounded-xl">
    <Button variant="ghost" class="w-full rounded-xl rounded-b-none border-1 h-fit !p-0" onclick={() => App.hideConsole = !App.hideConsole}>
        {#if !App.hideConsole}
            <ChevronDownIcon/>
        {:else}
            <ChevronUpIcon/>
        {/if}
    </Button>
    {#if !App.hideConsole}
<Card.Root class="!rounded-t-none border-t-0 w-full h-full min-h-50 p-1 relative">
    <Card.Content class="p-1 px-1 overflow-hidden h-full">
        <div class="flex justify-end h-fit">
            <label class="mr-auto text-md">Console</label>
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