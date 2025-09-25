<svelte:options customElement={{tag: "dbe-label", shadow: "none"}} />
<script>
    import {Label} from "$lib/components/ui/label/index.js";
    const {name, children, ...other} = $props()
</script>
<Label {...other} class="{other.class}" >
    {name}
</Label>
