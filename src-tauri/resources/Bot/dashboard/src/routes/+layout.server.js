export async function load({ locals }) {
	return {
		name: locals.bot.client.user.username,
		icon: locals.bot.client.user.avatarURL(),
		guildCount: locals.bot.client.application.approximateGuildCount,
		isAdmin: locals.isAdmin
	};
}
