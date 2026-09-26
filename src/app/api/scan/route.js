export async function GET(request) {
  try {
    const url = new URL(request.url);
    const site = url.searchParams.get("url");

    if (!site) {
      return new Response(
        JSON.stringify({ error: "Add ?url=example.com" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const apiKey = process.env.PAGESPEED_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "API key not set" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const pageSpeedUrl =
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
        site
      )}&key=${apiKey}&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO`;

    const res = await fetch(pageSpeedUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/153.0.0.0 Safari/537.36",
        Accept: "application/json",
      },
    });

    const text = await res.text();

    if (!res.ok) {
      return new Response(
        JSON.stringify({
          error: "We couldn't scan this website right now. Please try a different website.",
          status: res.status,
          statusText: res.statusText,
          response: text,
        }),
        {
          status: res.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const data = JSON.parse(text);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Something went wrong",
        message: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}