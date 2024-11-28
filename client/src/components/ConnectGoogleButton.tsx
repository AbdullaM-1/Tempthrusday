import { useState, useEffect } from "react";
import { LoadingButton } from "@/components";
import { CookiesApi } from "@/utils";
import axios from "axios";

const { VITE_APP_BASE_URL } = import.meta.env;

export const ConnectGoogleButton = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const accessToken = CookiesApi.getValue("accessToken"); // Bearer token for authorization header
    if (accessToken) {
      axios
        .get(`${VITE_APP_BASE_URL}/api/auth/google/status`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          setIsConnected(response.data.isConnected);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []);

  const handleConnect = () => {
    window.location.href = `${VITE_APP_BASE_URL}/api/auth/google`;
  };

  return (
    <LoadingButton
      onClick={handleConnect}
      disabled={isConnected || isLoading}
      isLoading={isLoading}
      className="min-w-32"
    >
      {isConnected ? "Connected to Google" : "Connect Google Account"}
    </LoadingButton>
  );
};
