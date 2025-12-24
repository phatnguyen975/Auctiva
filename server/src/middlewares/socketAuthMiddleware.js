import { supabase } from "../configs/supabase.js";

export const socketAuth = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error("Unauthorized"));
    }

    const { data, error } = await supabase.auth.getUser(token);
    if (error) {
      return next(new Error("Invalid token"));
    }

    socket.user = data.user;
    next();
  } catch (error) {
    next(error);
  }
};
