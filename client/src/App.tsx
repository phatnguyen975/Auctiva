import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store/store";
import { supabase } from "./lib/supabaseClient";
import {
  fetchProfileThunk,
  setIsCheckingAuth,
  setSession,
  setUser,
} from "./store/slices/authSlice";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  const isCheckingAuth = useSelector(
    (state: RootState) => state.auth.isCheckingAuth
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch(setSession(session));

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
        dispatch(setIsCheckingAuth(false));
      }
    });

    // Listen auth state change
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        dispatch(setSession(session));

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
          dispatch(setIsCheckingAuth(false));
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [dispatch]);

  if (isCheckingAuth) {
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
