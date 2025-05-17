import React, { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { Toaster as ShadcnToaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { toast as hotToast } from "react-hot-toast";

const MainLayout = () => {
  const { toast } = useToast();

  const ws = useRef(null);

  const connectWebSocket = () => {
    if (ws.current && ws.current.readyState !== WebSocket.CLOSED) {
      console.info("WebSocket is already connected or connecting.");
      return;
    }

    ws.current = new WebSocket("wss://localhost:7206/ws");

    ws.current.onopen = () => {
      hotToast.success("WebSocket connected");
      console.info("WebSocket connected");
    };

    ws.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log("Parsed WebSocket message:", message);

        if (message.success) {
          toast({
            title: (
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm">
                  New Order by {message.user}
                </p>
              </div>
            ),
            description: (
              <div className="mt-1 text-sm text-muted-foreground space-y-1">
                {message.data.map((order, index) => (
                  <div key={index}>
                    {message.user} just purchased {order.Quantity} cop
                    {order.Quantity > 1 ? "ies" : "y"} of{" "}
                    <strong>{order?.Book?.Title}</strong>.
                  </div>
                ))}
              </div>
            ),
          });
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
        toast({
          title: "Error",
          description: "Failed to parse WebSocket message.",
        });
      }
    };

    ws.current.onclose = () => {
      console.warn("WebSocket closed");
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  };

  useEffect(() => {
    connectWebSocket();
  }, []);
  return (
    <>
      <Navbar />
      <Outlet />

      <ShadcnToaster />
    </>
  );
};

export default MainLayout;
