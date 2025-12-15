import { error } from '@sveltejs/kit';
export async function load({ locals, params }) {
	const inputs = locals.dashboard.inputs.map((i) => ({
		...i,
		value: locals.dashboard.getInputValue(params.id, i.name)
	}));
	const guild = locals.guilds.find((g) => g.id === params.id);
	if (!guild) {
		throw error(404, 'Not found');
	}
	let roles = await locals.bot.client.cluster.broadcastEval(
		(c, { guildId }) =>
			c.guilds.cache.get(guildId).roles.cache.map((v) => ({ name: v.name, id: v.id })),
		{ context: { guildId: guild.id } }
	);
	roles = roles.flat();
	let members = await locals.bot.client.cluster.broadcastEval(
		(c, { guildId }) =>
			c.guilds.cache.get(guildId).members.cache.map((v) => ({ name: v.displayName, id: v.id })),
		{ context: { guildId: guild.id } }
	);
	members = members.flat();
	let channels = await locals.bot.client.cluster.broadcastEval(
		(c, { guildId }) =>
			c.guilds.cache.get(guildId).channels.cache.map((v) => ({
				name: v.name,
				id: v.id,
				type: v.type,
				isTextBased: v.isTextBased(),
				isVoiceBased: v.isVoiceBased()
			})),
		{ context: { guildId: guild.id } }
	);
	channels = channels.flat();
	return {
		roles,
		members,
		channels,
		guild,
		inputs,
		page: params.page.toLowerCase()
	};
}
