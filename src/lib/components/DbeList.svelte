<svelte:options customElement={{tag: "dbe-list", shadow: "none"}} />
<script>
    import { v4 as uuidv4 } from "uuid";
    import List from "$lib/components/List.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import {App} from "$lib/classes/App.svelte.js";
    import CustomElement from "$lib/classes/CustomElement.svelte.js";
    let {modalId, itemTitle = "() => {}", ...props} = $props()
    let open = $state(false)
    let items = $state([])
    let init = $state(false)
    $host().getItems = () => items
    $host().setItems = (values) => items = values
    $host().init = () => {
        init = true
        itemTitle = eval(`(${itemTitle})`)
    }
    let selected = $state(new CustomElement())
    let ref;
    document.getElementById(modalId).querySelectorAll("*").forEach((el) => {
        if(el.getAttribute("ignoreParsing") === modalId) el.removeAttribute("ignoreParsing")
    })
    let html = document.getElementById(modalId).innerHTML
    document.getElementById(modalId).querySelectorAll("*").forEach((el) => {
        if(!el.hasAttribute("ignoreParsing")) el.setAttribute("ignoreParsing", modalId)
    })
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
        App.initUI(ref)
    }, 10)
}} {items} itemTitle={(item, i) => init ? itemTitle(item, i + 1) : ""} onadd={() => items.push(new CustomElement(uuidv4()))} ondelete={() => {
    items.splice(items.indexOf(selected), 1);
}} bind:selected></List>
{#if init}
{#await itemTitle(selected, items.indexOf(selected) + 1) then title}
<Modal bind:open title={title} onDone={editItem}>
    <div class="grid gap-4 py-4 px-1" bind:this={ref}>
        {@html html}
    </div>
</Modal>
{/await}
    {/if}