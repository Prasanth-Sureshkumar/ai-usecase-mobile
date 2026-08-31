import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { clearAuthSession } from "../api/tokenStorage";
import { colors as defaultColors } from "../constants/colors";
import { getAppInit } from "../services/appConfig";

const emptyConfig = {
  organization: {},
  user: {
    permissions: [],
  },
  theme: {},
  menu: {
    bottomMenu: [],
    moreMenu: [],
  },
};

const normalizeConfig = data => ({
  organization: data?.organization || {},
  user: {
    ...(data?.user || {}),
    permissions: Array.isArray(data?.user?.permissions)
      ? data.user.permissions
      : [],
  },
  theme: data?.theme || {},
  menu: {
    bottomMenu: Array.isArray(data?.menu?.bottomMenu)
      ? data.menu.bottomMenu
      : [],
    moreMenu: Array.isArray(data?.menu?.moreMenu) ? data.menu.moreMenu : [],
  },
});

const AppConfigContext = createContext({
  ...emptyConfig,
  colors: defaultColors,
  initialized: false,
  loading: false,
  error: "",
  refreshAppConfig: async () => ({ success: false }),
  clearAppConfig: () => {},
});

export const AppConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const clearAppConfig = useCallback(() => {
    setConfig(null);
    setError("");
    setLoading(false);
  }, []);

  const refreshAppConfig = useCallback(async () => {
    setLoading(true);
    setError("");

    const response = await getAppInit();
    setLoading(false);

    if (response.success) {
      const nextConfig = normalizeConfig(response.data);
      setConfig(nextConfig);
      return {
        ...response,
        data: nextConfig,
      };
    }

    if (response.status === 401 || response.status === 403) {
      await clearAuthSession();
      clearAppConfig();
      return {
        ...response,
        authExpired: true,
      };
    }

    const message = response.message || "Unable to initialize the app.";
    setError(message);
    return {
      ...response,
      message,
    };
  }, [clearAppConfig]);

  const resolvedConfig = config || emptyConfig;
  const organization = resolvedConfig.organization;
  const user = resolvedConfig.user;
  const theme = resolvedConfig.theme;
  const menu = resolvedConfig.menu;

  const resolvedColors = useMemo(
    () => ({
      ...defaultColors,
      ...(theme || {}),
    }),
    [theme],
  );

  const value = useMemo(
    () => ({
      organization,
      user,
      theme,
      menu,
      colors: resolvedColors,
      initialized: Boolean(config),
      loading,
      error,
      refreshAppConfig,
      clearAppConfig,
    }),
    [
      clearAppConfig,
      config,
      error,
      loading,
      menu,
      organization,
      refreshAppConfig,
      resolvedColors,
      theme,
      user,
    ],
  );

  return (
    <AppConfigContext.Provider value={value}>
      {children}
    </AppConfigContext.Provider>
  );
};

export const useAppConfig = () => {
  return useContext(AppConfigContext);
};

export const useTheme = () => {
  const { colors } = useAppConfig();
  return { colors };
};
