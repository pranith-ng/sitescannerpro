export async function GET(request) {
  const url = new URL(request.url);
  const site = url.searchParams.get("url");

  if (!site) return new Response("Add ?url=example.com", { status: 400 });

  const apiKey = process.env.PAGESPEED_API_KEY;
  if (!apiKey) return new Response("API key not set", { status: 500 });

  const res = await fetch(
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(site)}&key=${apiKey}&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO`
  );

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
