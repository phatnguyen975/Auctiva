import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabaseClient";
import type { Profile } from "../../types/profile";
import type { RootState } from "../store";

// Register Thunk
export const registerThunk = createAsyncThunk(
  "auth/register",
  async (
    {
      full_name,
      address,
      email,
      password,
      captchaToken,
    }: {
      full_name: string;
      address: string;
      email: string;
      password: string;
      captchaToken: string;
    },
    { rejectWithValue }
  ) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        captchaToken,
        data: { full_name, address },
      },
    });

    if (error) {
      return rejectWithValue(error.message);
    }

    return true;
  }
);

// Verify Email Thunk
export const verifyEmailThunk = createAsyncThunk(
  "auth/verifyEmail",
  async (
    { email, code }: { email: string; code: string },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const isPasswordReset = state.auth.isPasswordReset;

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: isPasswordReset ? "recovery" : "email",
    });

    if (error) {
      return rejectWithValue(error.message);
    }

    return true;
  }
);

// Login Thunk
export const loginThunk = createAsyncThunk(
  "auth/login",
  async (
    {
      email,
      password,
      captchaToken,
    }: { email: string; password: string; captchaToken: string },
    { rejectWithValue }
  ) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: { captchaToken },
    });

    if (error) {
      return rejectWithValue(error.message);
    }

    return true;
  }
);

export const loginWithGoogleThunk = createAsyncThunk(
  "auth/login-google",
  async (_, { rejectWithValue }) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      return rejectWithValue(error.message);
    }

    return true;
  }
);

export const loginWithGitHubThunk = createAsyncThunk(
  "auth/login-github",
  async (_, { rejectWithValue }) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
    });

    if (error) {
      return rejectWithValue(error.message);
    }

    return true;
  }
);

// Logout Thunk
export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return rejectWithValue(error.message);
    }

    return true;
  }
);

// Fetch Profile Thunk
export const fetchProfileThunk = createAsyncThunk(
  "auth/fetchProfile",
  async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as Profile;
  }
);

// Send OTP Thunk
export const sendOtpThunk = createAsyncThunk(
  "auth/sendOtp",
  async (
    { email, captchaToken }: { email: string; captchaToken: string },
    { rejectWithValue }
  ) => {
    const { data: user, error: userError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .single();

    if (userError || !user) {
      return rejectWithValue("User not found");
    }

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      { captchaToken }
    );

    if (resetError) {
      return rejectWithValue(resetError.message);
    }

    return true;
  }
);

// Reset Password Thunk
export const resetPasswordThunk = createAsyncThunk(
  "auth/resetPassword",
  async (password: string, { rejectWithValue }) => {
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      return rejectWithValue(error.message);
    }

    return true;
  }
);

// Slice
interface AuthUser {
  user: User | null;
  profile: Profile | null;
}

interface AuthState {
  authUser: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  isPasswordReset: boolean;
  isCheckingAuth: boolean;
  hasCheckedAuth: boolean;
}

const initialState: AuthState = {
  authUser: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
  isPasswordReset: false,
  isCheckingAuth: true,
  hasCheckedAuth: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.authUser = action.payload;
    },
    setSession(state, action) {
      const session = action.payload;
      state.accessToken = session?.access_token ?? null;
      state.refreshToken = session?.refresh_token ?? null;
    },
    setIsPasswordReset(state, action: PayloadAction<boolean>) {
      state.isPasswordReset = action.payload;
      sessionStorage.setItem("isPasswordReset", String(action.payload));
    },
    setIsCheckingAuth(state, action: PayloadAction<boolean>) {
      state.isCheckingAuth = action.payload;
    },
    setHasCheckedAuth(state, action: PayloadAction<boolean>) {
      state.hasCheckedAuth = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Register ---
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Register failed";
      })
      // --- Verify Email ---
      .addCase(verifyEmailThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmailThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyEmailThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Verify email failed";
      })
      // --- Login ---
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Login failed";
      })
      // --- Logout ---
      .addCase(logoutThunk.fulfilled, (state) => {
        state.authUser = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.loading = false;
        state.error = null;
        state.isPasswordReset = false;
        state.isCheckingAuth = true;
      })
      // --- Fetch Profile ---
      .addCase(fetchProfileThunk.pending, (state) => {
        state.isCheckingAuth = true;
        state.error = null;
      })
      .addCase(fetchProfileThunk.fulfilled, (state, action) => {
        if (!state.authUser) {
          return;
        }
        state.isCheckingAuth = false;
        state.authUser.profile = action.payload;
      })
      // --- Send OTP ---
      .addCase(sendOtpThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtpThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendOtpThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Send OTP failed";
      })
      // --- Reset Password ---
      .addCase(resetPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Reset password failed";
      });
  },
});

export const {
  setUser,
  setSession,
  setIsPasswordReset,
  setIsCheckingAuth,
  setHasCheckedAuth,
} = authSlice.actions;

export default authSlice.reducer;
