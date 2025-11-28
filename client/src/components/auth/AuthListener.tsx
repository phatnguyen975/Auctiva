import { useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/slices/authSlice";

const AuthListener = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch(setUser(session?.user ?? null));
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        dispatch(setUser(session?.user ?? null));
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [dispatch]);

  return null;
}

export default AuthListener;
