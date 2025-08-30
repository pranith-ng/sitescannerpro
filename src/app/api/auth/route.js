import { createClient } from "@supabase/supabase-js";

// POST route handler
export async function POST(req) {
  const { action, email, password, provider } = await req.json();

  // Get access token from client (via Authorization header)
  const authHeader = req.headers.get("authorization");

  // Create a Supabase client with forwarded auth header
  const supabaseServer = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          Authorization: authHeader, // ✅ Forward user’s access token if present
        },
      },
    }
  );

  try {
    let result;

    if (action === "login") {
      if (!email || !password) {
        return new Response(JSON.stringify({ error: "Email and password required" }), {
          status: 400,
        });
      }

      result = await supabaseServer.auth.signInWithPassword({ email, password });

    } else if (action === "signup") {
      if (!email || !password) {
        return new Response(JSON.stringify({ error: "Email and password required" }), {
          status: 400,
        });
      }

      result = await supabaseServer.auth.signUp({ email, password });

    } else if (action === "google") {
      if (!provider || provider !== "google") {
        return new Response(JSON.stringify({ error: "Provider must be google" }), {
          status: 400,
        });
      }

      result = await supabaseServer.auth.signInWithOAuth({ provider: "google" });

    } else if (action === "session") {
      const {
        data: { user },
        error,
      } = await supabaseServer.auth.getUser();

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
      }

      return new Response(JSON.stringify({ user: user || null }), { status: 200 });

    } else if (action === "signout") {
      const { error } = await supabaseServer.auth.signOut();
      if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
      }

      return new Response(JSON.stringify({ message: "Signed out successfully" }), {
        status: 200,
      });

    } else {
      return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400 });
    }

    if (result?.error) {
      return new Response(JSON.stringify({ error: result.error.message }), { status: 400 });
    }

    return new Response(
      JSON.stringify({
        user: result?.data?.user || null,
        session: result?.data?.session || null,
        url: result?.data?.url || null,
      }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
