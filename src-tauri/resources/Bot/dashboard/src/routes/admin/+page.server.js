import { error } from '@sveltejs/kit';

export async function load({ locals }) {
	const botName = locals.bot.client.user.username
	const inputs = locals.dashboard.inputs
	const isAdmin = locals.isAdmin;
	if (!isAdmin) {
		throw error(403, "Forbidden");
	}
	return {
		botName,
		inputs
	};
}