<script>
    import * as Card from '$lib/components/ui/card/index.js';
    import {Button} from "$lib/components/ui/button/index.js";
    import {TrashIcon} from "@lucide/svelte";
    import {BotManager} from "$lib/classes/BotManager.svelte.js";
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
            BotManager.selectBot(bot)
            localStorage.setItem("selectedBot", BotManager.bots.indexOf(bot))
        }} variant={bot.path === BotManager.selectedBot?.path ? "outline" : undefined} disabled={bot.path === BotManager.selectedBot?.path} class="flex-auto">{bot.path === BotManager.selectedBot?.path ? "Selected" : "Select"}</Button>
        <Button variant="destructive" onclick={() => BotManager.deleteBot(bot.name, bot.path)}><TrashIcon/></Button>
    </Card.Footer>
</Card.Root>