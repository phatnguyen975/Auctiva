import { useEffect, useRef } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store/store";
import { supabase } from "./lib/supabaseClient";
import {
  fetchProfileThunk,
  setHasCheckedAuth,
  setIsCheckingAuth,
  setSession,
  setUser,
} from "./store/slices/authSlice";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  const { hasCheckedAuth } = useSelector((s: RootState) => s.auth);
  const dispatch = useDispatch<AppDispatch>();

  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const initializeAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        dispatch(setSession(session));
        dispatch(setUser({ user: session.user, profile: null }));
        dispatch(fetchProfileThunk(session.user.id));
      } else {
        dispatch(setUser(null));
        dispatch(setSession(null));
      }

      dispatch(setHasCheckedAuth(true));
      dispatch(setIsCheckingAuth(false));
    };

    initializeAuth();

    // Listen auth state change
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          dispatch(setSession(session));
          dispatch(
            setUser({
              user: session.user,
              profile: null,
            })
          );
          dispatch(fetchProfileThunk(session.user.id));
        } else {
          dispatch(setUser(null));
          dispatch(setSession(null));
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [dispatch]);

  if (!hasCheckedAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{ duration: 2000 }}
      />

      <AppRoutes />
    </>
  );
};

export default App;
