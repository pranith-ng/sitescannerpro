"use client";

import { supabase } from "@/lib/supabaseClient";

export default async function AuthHandler({ email, password, action, provider }) {
  try {
    if (action === "signup") {
      const result = await supabase.auth.signUp({ email, password });
      if (result.error) throw result.error;
      return result;
    }

    if (action === "login") {
      const result = await supabase.auth.signInWithPassword({ email, password });
      if (result.error) throw result.error;
      return result;
    }

    if (action === "signout") {
      const result = await supabase.auth.signOut();
      if (result.error) throw result.error;
      return { message: "Signed out" };
    }

    if (action === "oauth" && provider === "google"){
      const result = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin
        },
      })
      if(result.error) throw result.error;
      return result;
    }

    throw new Error("Invalid action. Use 'login', 'signup', or 'signout'.");
  } catch (err) {
    console.error("AuthHandler error:", err.message);
    return { error: err.message };
  }
}
