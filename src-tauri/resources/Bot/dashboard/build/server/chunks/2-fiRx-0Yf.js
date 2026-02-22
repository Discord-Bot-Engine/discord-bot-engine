async function load({ locals }) {
  return {
    guilds: locals.guilds
  };
}

var _page_server = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 2;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-C_pcWSE_.js')).default;
const server_id = "src/routes/+page.server.js";
const imports = ["_app/immutable/nodes/2.B3M7KR-0.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/NgqrPNVi.js","_app/immutable/chunks/pwS3GfhJ.js","_app/immutable/chunks/jJXQuL90.js","_app/immutable/chunks/DaUXdgD5.js"];
const stylesheets = ["_app/immutable/assets/card-title.bHHIbcsu.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server as server, server_id, stylesheets };
//# sourceMappingURL=2-fiRx-0Yf.js.map
