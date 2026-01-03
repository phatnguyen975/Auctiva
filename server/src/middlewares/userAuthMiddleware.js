import { supabase } from "../configs/supabase.js";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Missing token" });
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const authorize = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", req.user.id)
        .single();

      if (!profile) {
        return res.status(403).json({ message: "User not found" });
      }

      if (!allowedRoles.includes(profile.role)) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      req.user.role = profile.role;
      next();
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };
};

export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    req.user = null;
    return next();
  }

  try {
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Missing token" });
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = user;
  } catch {
    req.user = null;
  }

  next();
};
