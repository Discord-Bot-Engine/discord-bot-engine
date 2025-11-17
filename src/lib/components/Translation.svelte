<script>
    import {App} from "$lib/classes/App.svelte.js";
    let { text } = $props()
</script>
{#await App.translate(text, App.selectedLanguage)}
    {text}
{:then value}
    {value}
{:catch error}
    {text}
{/await}