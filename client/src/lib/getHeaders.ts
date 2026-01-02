const API_KEY = import.meta.env.VITE_API_KEY;
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export const getHeaders = () => {
  // Get access token from localStorage (Supabase format)
  let accessToken = "";
  try {
    const projectRef = SUPABASE_URL?.split("//")[1]?.split(".")[0];
    if (projectRef) {
      const storageKey = `sb-${projectRef}-auth-token`;
      const storedSession = localStorage.getItem(storageKey);
      if (storedSession) {
        const session = JSON.parse(storedSession);
        accessToken = session?.access_token || "";
      }
    }
  } catch (error) {
    console.error("Error reading session from localStorage:", error);
  }

  return {
    "x-api-key": API_KEY,
    Authorization: accessToken ? `Bearer ${accessToken}` : "",
  };
};
