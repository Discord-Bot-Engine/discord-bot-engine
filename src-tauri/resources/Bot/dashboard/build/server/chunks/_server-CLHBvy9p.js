import fetch from 'node-fetch';

const MANAGE_GUILD = 32;
async function GET({ url, platform }) {
  const code = url.searchParams.get("code");
  let origin = url.origin;
  if (origin.startsWith("https://localhost")) origin = origin.replace("https://", "http://");
  if (!code) return new Response("Missing code", { status: 400 });
  const redirectUri = `${origin}/auth/callback`;
  const bot = platform?.req.bot.client;
  const body = new URLSearchParams({
    client_id: bot.user.id,
    client_secret: platform?.req.dashboard.clientSecret,
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    scope: "identify guilds"
  });
  const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });
  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    return new Response("OAuth failed", { status: 400 });
  }
  const userRes = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` }
  });
  const user = await userRes.json();
  const guildsRes = await fetch("https://discord.com/api/users/@me/guilds", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` }
  });
  const guilds = await guildsRes.json();
  platform.req.session.user = user;
  const application = bot.application.partial ? await bot.application.fetch() : bot.application;
  platform.req.session.isAdmin = application.owner.id === user.id || application.owner.members?.has(user.id);
  platform.req.session.guilds = guilds.filter(
    (guild) => bot.guilds.cache.get(guild.id) && (BigInt(guild.permissions) & BigInt(MANAGE_GUILD)) === BigInt(MANAGE_GUILD)
  );
  return Response.redirect(origin, 302);
}

export { GET };
//# sourceMappingURL=_server-CLHBvy9p.js.map
