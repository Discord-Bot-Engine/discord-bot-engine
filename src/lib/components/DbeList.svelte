<svelte:options customElement={{tag: "dbe-list", shadow: "none"}} />
<script>
    import { v4 as uuidv4 } from "uuid";
    import List from "$lib/components/List.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import {App} from "$lib/classes/App.svelte.js";
    import CustomElement from "$lib/classes/CustomElement.svelte.js";
    let {modalId, itemTitle = "() => {}", ...props} = $props()
    itemTitle = eval(`(${itemTitle})`)
    let open = $state(false)
    let items = $state([])
    $host().getItems = () => items
    $host().setItems = (values) => items = values
    let selected = $state(new CustomElement())
    let ref;
    let html = document.getElementById(modalId).innerHTML
    function editItem() {
        const data = selected.data
        App.saveUIData(ref, data)
        open = false
    }
</script>
<List {...props} ondblclick={(item) => {
    open = true;
    let interval = setInterval(() => {
        if(!ref) return;
        clearInterval(interval);
        const data = selected.data
        App.loadUIData(ref, data)
    }, 10)
}} {items} itemTitle={(item, i) => itemTitle(item, i + 1)} onadd={() => items.push(new CustomElement(uuidv4()))} ondelete={() => {
    items.splice(items.indexOf(selected), 1);
}} bind:selected></List>
<Modal bind:open title={itemTitle(selected, items.indexOf(selected) + 1)} onDone={editItem}>
    <div class="grid gap-4 py-4" bind:this={ref}>
        {@html html}
    </div>
</Modal>