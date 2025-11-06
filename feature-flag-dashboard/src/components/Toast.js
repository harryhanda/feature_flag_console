import React from "react";
import { Toaster } from "react-hot-toast";

export default function Toast() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
            success: { style: { background: "#16a34a", color: "white" } },
            error: { style: { background: "#dc2626", color: "white" } },
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      }}
    />
  );
}
