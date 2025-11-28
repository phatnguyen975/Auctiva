import { useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useDispatch } from "react-redux";
import { fetchProfileThunk, setUser } from "../../store/slices/authSlice";
import type { AppDispatch } from "../../store/store";

const AuthListener = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        dispatch(
          setUser({
            user: session.user,
            profile: null,
          })
        );

        dispatch(fetchProfileThunk(session.user.id));
      } else {
        dispatch(setUser(null));
      }
    });

    // Listen auth state change
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          dispatch(
            setUser({
              user: session.user,
              profile: null,
            })
          );

          dispatch(fetchProfileThunk(session.user.id));
        } else {
          dispatch(setUser(null));
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return null;
};

export default AuthListener;
