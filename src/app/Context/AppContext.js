"use client";
import { createContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [count, setCount] = useState(0);
  const [aiprompt, setaiprompt] = useState("")
  const [user, setUser] = useState(null);


  useEffect(() => {
  // Check if a user session exists on page load
  supabase.auth.getSession().then(function(result) {
    if (result.data && result.data.session && result.data.session.user) {
      setUser(result.data.session.user);
    } else {
      setUser(null);
    }
  });

  // Listen for changes in authentication (login/logout)
  const listener = supabase.auth.onAuthStateChange(function(event, session) {
    if (session && session.user) {
      setUser(session.user);
    } else {
      setUser(null);
    }
  });

  // Cleanup the listener when component unmounts
  return function cleanup() {
    listener.data.unsubscribe();
  };
}, []);

 


  return (
    <AppContext.Provider value={{ count, setCount, aiprompt, setaiprompt, user, setUser }}>
      {children}
    </AppContext.Provider>
  );
};
