<script>
    import * as Card from '$lib/components/ui/card/index.js';
    import {App} from '$lib/classes/App.svelte.js';
    import {Button} from "$lib/components/ui/button/index.js";
    import {TrashIcon} from "@lucide/svelte";
    let {bot } = $props()
</script>
<Card.Root class="w-full h-fit">
    <Card.Header>
        <Card.Title>
            {bot.name}
        </Card.Title>
        <Card.Description>
            {bot.path}
        </Card.Description>
    </Card.Header>
    <Card.Footer class="flex-row gap-2">
        <Button onclick={() => {
            App.selectedBot = bot
            localStorage.setItem("selectedBot", App.bots.indexOf(bot))
        }} variant={bot.path === App.selectedBot?.path ? "outline" : undefined} disabled={bot.path === App.selectedBot?.path} class="flex-auto">{bot.path === App.selectedBot?.path ? "Selected" : "Select"}</Button>
        <Button variant="destructive" onclick={() => App.deleteBot(bot.name, bot.path)}><TrashIcon/></Button>
    </Card.Footer>
</Card.Root>