<script>
    import {App} from "$lib/classes/App.svelte.js";
    let { text, el } = $props()
</script>
{#if el}
    {#await App.translate(text, App.selectedLanguage)}
        {@render el(text)}
    {:then value}
        {@render el(value)}
    {:catch error}
        {@render el(text)}
    {/await}
{:else}
    {#await App.translate(text, App.selectedLanguage)}
        {text}
    {:then value}
        {value}
    {:catch error}
        {text}
    {/await}
{/if}