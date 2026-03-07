export async function load({ locals }) {
	const guilds = await locals.bot.client.cluster.broadcastEval(
		async (c, { id }) => {
			const results = await Promise.all(
				c.guilds.cache.map(async (g) => {
					const member = await g.members.fetch(id).catch(() => null);
					if (member?.permissions.has(0x20)) {
						return { id: g.id, name: g.name, icon: g.icon };
					}
					return null;
				})
			);
			return results.filter(Boolean);
		},
		{ context: { id: locals.user.id } }
	);

	return {
		guilds: guilds.flat()
	};
}
