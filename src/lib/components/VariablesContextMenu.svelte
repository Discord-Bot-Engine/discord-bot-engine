<script>
    import * as Card from '$lib/components/ui/card/index.js';
    import {Button} from "$lib/components/ui/button/index.js";
    import {ScrollArea} from "$lib/components/ui/scroll-area/index.js";
    import {App} from "$lib/classes/App.svelte.js"
    let open = $state(false)
    let x = $state(0)
    let y = $state(0)
    function insertText(value) {
        const active = document.activeElement;
        if (active && (active.tagName === "TEXTAREA" || active.tagName === "INPUT")) {
            const start = active.selectionStart;
            const end = active.selectionEnd;
            const text = active.value;

            active.value = text.slice(0, start) + value + text.slice(end);
            active.selectionStart = active.selectionEnd = start + value.length;

            active.dispatchEvent(new Event("input", { bubbles: true }));
        }
        if (active && active.hasAttribute("contenteditable")) {
            const sel = window.getSelection();
            if (!sel.rangeCount) return false;

            const range = sel.getRangeAt(0);
            range.deleteContents();

            const node = document.createTextNode(value);
            range.insertNode(node);
            range.setStartAfter(node);
            range.setEndAfter(node);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
    function isDescendant(el, id) {
        let parent = el
        while(parent) {
            if(parent.id === id) return true
            parent = parent.parentElement;
        }
        return false;
    }
</script>
<Card.Root id="ctx" class="p-1 {open ? '' : 'hidden'} rounded-lg absolute min-w-40 text-sm z-[9999999] pointer-events-auto" style="position: absolute; top:{y}px; left:{x}px;">
    <Card.Content class="p-0">
        <ScrollArea>
            <div class="max-h-40">
            {#each App.selectedTrigger?.variables.keys().toArray() as v}
        <div>
                <Button
                variant="ghost"
                class="size-7 w-full text-muted-foreground hover:!bg-accent justify-start"
                onclick={() => {
                    insertText(`\${variables[\`${v}\`]}`)
                    open = false
                }}
        >
            Insert "{v}" variable
        </Button>

        </div>
            {/each}
            </div>
        </ScrollArea>
    </Card.Content>
</Card.Root>

<svelte:window oncontextmenu={async (ev) => {
    ev.preventDefault();
    if(ev.target.value === undefined || ev.target.tagName === "BUTTON" || ev.target.hasAttribute("noVariables")) return;
    x = ev.clientX;
    y = ev.clientY;
    open = true
}} onmousedown={
    (ev) => {
            if(!isDescendant(ev.target, "ctx")) open = false
        }
}></svelte:window>