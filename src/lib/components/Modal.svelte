<script>
    import {Button, buttonVariants} from "$lib/components/ui/button/index.js";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import {ScrollArea} from "$lib/components/ui/scroll-area/index.js";

    let {open = $bindable(), title, children, onDone = () => {}, onOpenChange = () => {} } = $props()
</script>
<Dialog.Root bind:open onOpenChange={onOpenChange}>
    <Dialog.Content class="sm:max-w-[65vw]" >
        <Dialog.Header>
            <Dialog.Title>{title}</Dialog.Title>
        </Dialog.Header>
        <ScrollArea class="max-h-[70vh]">
            {@render children()}
        </ScrollArea>
        <Dialog.Footer>
            <Dialog.Close class={buttonVariants({variant:"secondary"})}>Cancel</Dialog.Close>
            <Button onclick={onDone}>Done</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>