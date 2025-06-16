
const ALLOWED_ORIGINS = [
	"https://app.1delta.io",
	"http://localhost:3000",
	"http://localhost:5173",
	"https://staging.1delta.io",
	"https://currency-viewer.pages.dev",
];

function withCors(resp: Response, origin: string | null): Response {
	const headers = new Headers(resp.headers);

	if (origin && ALLOWED_ORIGINS.includes(origin)) {
		headers.set("Access-Control-Allow-Origin", origin);
		headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
		headers.set("Access-Control-Allow-Headers", "Content-Type");
	}

	return new Response(resp.body, {
		status: resp.status,
		statusText: resp.statusText,
		headers,
	});
}

function parseAssetId(input: string): string {
	try {
		return decodeURIComponent(input.trim());
	} catch (e) {
		console.warn("Failed to decode assetId:", input, e);
		return input;
	}
}

export default {
	async fetch(req: Request, env: Env): Promise<Response> {
		const url = new URL(req.url);
		const assetId = url.pathname.split("/")[2];
		const route = url.pathname.split("/")[1];
		const origin = req.headers.get("Origin");

		// Handle preflight OPTIONS request
		if (req.method === "OPTIONS") {
			if (origin && ALLOWED_ORIGINS.includes(origin)) {
				return new Response(null, {
					status: 204,
					headers: {
						"Access-Control-Allow-Origin": origin,
						"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
						"Access-Control-Allow-Headers": "Content-Type",
					},
				});
			}
			return new Response(null, { status: 403 });
		}

		let resp: Response;

		switch (route) {
			case "margin":
				if (req.method !== "POST") {
					resp = new Response("Only POST allowed for /margin", { status: 405 });
				} else {

					resp = new Response("not yet implemented", { status: 404 });
				}
				break;
			default:
				resp = new Response("Not found", { status: 404 });
		}

		return withCors(resp, origin);
	},
};
