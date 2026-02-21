async function GET(event) {
  const req = event.platform?.req;
  const bot = req?.bot;
  const url = new URL("https://discord.com/api/oauth2/authorize");
  let origin = event.url.origin;
  if (origin.startsWith("https://localhost")) origin = origin.replace("https://", "http://");
  const redirectUri = `${origin}/auth/callback`;
  url.searchParams.set("client_id", bot.client.user.id);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "identify guilds");
  return Response.redirect(url.toString(), 302);
}

export { GET };
//# sourceMappingURL=_server-Cq6HfHag.js.map
