export async function load({ locals }) {
	return {
		name: locals.bot.client.user.username,
		icon: locals.bot.client.user.avatarURL(),
		isAdmin: locals.isAdmin
	};
}