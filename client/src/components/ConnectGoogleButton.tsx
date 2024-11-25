import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export const ConnectGoogleButton = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/auth/google/status")
      .then((response) => response.json())
      .then((data) => setIsConnected(data.isConnected));
  }, []);

  const handleConnect = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <Button onClick={handleConnect} disabled={isConnected}>
      {isConnected ? "Connected to Google" : "Connect Google Account"}
    </Button>
  );
};
