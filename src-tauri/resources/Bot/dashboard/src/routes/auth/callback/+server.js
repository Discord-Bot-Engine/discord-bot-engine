import fetch from 'node-fetch';

const ADMIN = 0x8;

export async function GET({ url, platform }) {
	const code = url.searchParams.get('code');

	let origin = url.origin;

	if (origin.startsWith('https://localhost')) origin = origin.replace('https://', 'http://');

	if (!code) return new Response('Missing code', { status: 400 });

	const redirectUri = `${origin}/auth/callback`;

	const body = new URLSearchParams({
		client_id: platform?.req.bot.client.user.id,
		client_secret: platform?.req.dashboard.clientSecret,
		grant_type: 'authorization_code',
		code,
		redirect_uri: redirectUri,
		scope: 'identify guilds'
	});

	const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body
	});
	const tokenData = await tokenRes.json();
	if (!tokenData.access_token) {
		return new Response('OAuth failed', { status: 400 });
	}

	const userRes = await fetch('https://discord.com/api/users/@me', {
		headers: { Authorization: `Bearer ${tokenData.access_token}` }
	});
	const user = await userRes.json();

	const guildsRes = await fetch('https://discord.com/api/users/@me/guilds', {
		headers: { Authorization: `Bearer ${tokenData.access_token}` }
	});
	const guilds = await guildsRes.json();

	const botRes = await fetch('https://discord.com/api/v10/oauth2/applications/@me', {
		headers: {
			Authorization: `Bot ${platform?.req.bot.client.token}`
		}
	});
	const data = await botRes.json();

	platform.req.session.user = user;
	platform.req.session.isAdmin = data.owner.id === user.id;
	platform.req.session.guilds = guilds.filter(
		(guild) =>
			platform?.req.bot.client.guilds.cache.get(guild.id) &&
			(BigInt(guild.permissions) & BigInt(ADMIN)) === BigInt(ADMIN)
	);

	return Response.redirect(origin, 302);
}
