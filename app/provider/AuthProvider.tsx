"use client";

import {
  createContext,
  useActionState,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthContextType, Role, User } from "../types";
import { apiCient } from "../lib/apiClient";

type LoginState = {
  success?: boolean;
  user?: User | null;
  error?: string;
};
const INITIAL_LOGIN_STATE: LoginState = {
  success: undefined,
  user: undefined,
  error: undefined,
};
const ROLE_HIERARCHY = {
  [Role.GUEST]: 0,
  [Role.USER]: 1,
  [Role.MANAGER]: 2,
  [Role.ADMIN]: 3,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (
    _: LoginState,
    formData: FormData,
  ): Promise<LoginState> => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = (await apiCient.login(email, password)) as unknown as {
        user: User;
      };

      setUser(response.user);

      return {
        success: true,
        user: response.user,
      };
    } catch (error) {
      console.error("Login failed:", error);

      return {
        error: error instanceof Error ? error.message : "Login failed",
      };
    }
  };

  const [loginState, loginAction, isLoginPending] = useActionState(
    login,
    INITIAL_LOGIN_STATE,
  );

  const logout = async () => {
    try {
      await apiCient.logout();
      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error("error at logout: ", error);
    }
  };

  const hasPermissions = (requiredRole: Role) => {
    if (!user) return false;

    return ROLE_HIERARCHY[user.role] >= ROLE_HIERARCHY[requiredRole];
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await apiCient.getCurrentUser();
        setUser(userData || null);
      } catch (err) {
        console.error("Error: ", err);
      }
    };

    loadUser();
  }, []);
  return (
    <AuthContext.Provider
      value={{
        user,
        login: loginAction,
        logout,
        hasPermissions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error(`useAuth must be used within an AuthProvider`);
  }

  return context;
};

export default AuthProvider;
