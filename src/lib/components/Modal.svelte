<script>
    import {Button, buttonVariants} from "$lib/components/ui/button/index.js";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import {ScrollArea} from "$lib/components/ui/scroll-area/index.js";
    import Translation from "$lib/components/Translation.svelte";

    let {open = $bindable(), title, children, onDone = () => {}, onOpenChange = () => {} } = $props()
</script>
<Dialog.Root bind:open onOpenChange={onOpenChange}>
    <Dialog.Content class="sm:max-w-[65vw] w-full px-4.5 overflow-hidden" >
        <Dialog.Header>
            <Dialog.Title>
                <Translation text={title} />
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