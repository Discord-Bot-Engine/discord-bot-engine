<script>
    import {Button, buttonVariants} from "$lib/components/ui/button/index.js";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import {ScrollArea} from "$lib/components/ui/scroll-area/index.js";
    import Translation from "$lib/components/Translation.svelte";
    import {ExternalLinkIcon} from "@lucide/svelte"
    import { openUrl } from '@tauri-apps/plugin-opener';
    let {open = $bindable(), url, title, children, onDone = () => {}, onOpenChange = () => {} } = $props()
</script>
<Dialog.Root bind:open onOpenChange={onOpenChange}>
    <Dialog.Content class="sm:max-w-[65vw] w-full px-4.5 overflow-hidden" >
        <Dialog.Header>
            <Dialog.Title>
                <div class="flex items-center gap-1">
                    {#if url}
                    <Translation text="Read More" el={readMore}/>
                    {#snippet readMore(text)}
                        <a class="!w-7 !p-0 !h-7 mt-[calc(var(--spacing)_*_-0.1)] {buttonVariants({ variant:'ghost'})}" title={text} onclick={() => openUrl(url)}><ExternalLinkIcon></ExternalLinkIcon></a>
                    {/snippet}
                    {/if}
                    <Translation text={title} />
                </div>
            </Dialog.Title>
        </Dialog.Header>
        <ScrollArea class="max-h-[60vh] w-full">
            {@render children()}
        </ScrollArea>
        <Dialog.Footer>
            <Dialog.Close class="{buttonVariants({variant:'secondary'})} !p-3 !h-fit">
                <Translation text="Cancel" />
            </Dialog.Close>
            <Button class="!p-3 !h-fit" onclick={onDone}>
                <Translation text="Done" />
            </Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>