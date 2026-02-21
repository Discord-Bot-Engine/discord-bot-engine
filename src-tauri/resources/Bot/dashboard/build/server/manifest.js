const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["robots.txt"]),
	mimeTypes: {".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.LYaqldBl.js",app:"_app/immutable/entry/app.B94EgVLs.js",imports:["_app/immutable/entry/start.LYaqldBl.js","_app/immutable/chunks/BhDKk6Ug.js","_app/immutable/chunks/CzY68dQD.js","_app/immutable/chunks/NgqrPNVi.js","_app/immutable/entry/app.B94EgVLs.js","_app/immutable/chunks/NgqrPNVi.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/CzY68dQD.js","_app/immutable/chunks/jJXQuL90.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./chunks/0-Bamh51P4.js')),
			__memo(() => import('./chunks/1-X_GrOoSK.js')),
			__memo(() => import('./chunks/2-CPN-0BeX.js')),
			__memo(() => import('./chunks/3-ezTr2Qbp.js')),
			__memo(() => import('./chunks/4-9MHuVe9m.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/admin",
				pattern: /^\/admin\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/admin/add",
				pattern: /^\/admin\/add\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server-rxo50yqC.js'))
			},
			{
				id: "/admin/delete",
				pattern: /^\/admin\/delete\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server-BB9hLQSD.js'))
			},
			{
				id: "/auth/callback",
				pattern: /^\/auth\/callback\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server-CLHBvy9p.js'))
			},
			{
				id: "/auth/login",
				pattern: /^\/auth\/login\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server-Cq6HfHag.js'))
			},
			{
				id: "/guild/[id]/[page]",
				pattern: /^\/guild\/([^/]+?)\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false},{"name":"page","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/guild/[id]/[page]/update",
				pattern: /^\/guild\/([^/]+?)\/([^/]+?)\/update\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false},{"name":"page","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server-BYonjeNE.js'))
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

const prerendered = new Set([]);

const base = "";

export { base, manifest, prerendered };
//# sourceMappingURL=manifest.js.map
