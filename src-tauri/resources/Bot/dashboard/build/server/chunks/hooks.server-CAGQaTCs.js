async function handle({ event, resolve }) {
  const req = event.platform?.req;
  const bot = req?.bot;
  const dashboard = req?.dashboard;
  if (req?.session?.user) {
    event.locals.user = req.session.user;
    event.locals.isAdmin = req.session.isAdmin;
    event.locals.guilds = req.session.guilds;
  }
  event.locals.bot = bot;
  event.locals.dashboard = dashboard;
  if (!event.locals.user && (event.url.pathname.startsWith("/guild/") || event.url.pathname.startsWith("/_app/") || ["/", "/admin/add", "/admin/delete"].includes(event.url.pathname))) {
    let origin = event.url.origin;
    if (origin.startsWith("https://localhost")) origin = origin.replace("https://", "http://");
    const loginUrl = new URL("/auth/login", origin);
    return Response.redirect(loginUrl.toString(), 302);
  }
  return resolve(event);
}

export { handle };
//# sourceMappingURL=hooks.server-CAGQaTCs.js.map
