<script>
    import '@fontsource-variable/jetbrains-mono';
    import * as Card from '$lib/components/ui/card/index.js';
    import {App} from "$lib/classes/App.svelte.js"
    import {Separator} from "$lib/components/ui/separator/index.js";
    import {SquareIcon, PlayIcon} from "@lucide/svelte";
    import {ScrollArea} from "$lib/components/ui/scroll-area/index.js";
    import {Button} from "$lib/components/ui/button/index.js";
</script>
<Card.Root class="w-full h-full p-1 relative">
    <Card.Content class="p-1 overflow-hidden h-full">
        <div class="flex justify-end h-fit">
            <label class="mr-auto opacity-50 text-md">Console</label>
            <Button variant={App.selectedBot?.isRunning ? undefined : 'outline'} size="icon" class="size-8 rounded-lg rounded-r-none" onclick={() => App.runBot()}><PlayIcon size={16} /></Button>
            <Button variant={App.selectedBot?.isRunning ? 'outline' : undefined} size="icon" class="size-8 rounded-lg rounded-l-none" onclick={() => App.stopBot()}><SquareIcon size={16} /></Button>
        </div>
        <ScrollArea class="font-[JetBrains_Mono_Variable] text-sm h-[calc(100%-1.8rem)]">
            <pre class="whitespace-pre-wrap">{App.selectedBot?.stdout}</pre>
        </ScrollArea>
    </Card.Content>
</Card.Root>