"use client"

import { useEffect, useCallback } from "react";

declare global {
  interface Window {
    initSendOTP: (config: any) => void;
    sendOtp: (
      identifier: string,
      onSuccess?: (data: any) => void,
      onError?: (error: any) => void
    ) => void;
  }
}

export const useMsg91 = (onSuccess: (data: any) => void, onFailure: (err: any) => void) => {
  const WIDGET_ID = "3664736e4671363638353237";
  const TOKEN_AUTH = "395689T4cE12EIGpi69e4eb08P1";

  useEffect(() => {
    const configuration = {
      widgetId: WIDGET_ID,
      tokenAuth: TOKEN_AUTH,
      exposeMethods: true,
      success: (data: any) => {
        console.log('✅ MSG91 success:', data);
        onSuccess(data);
      },
      failure: (error: any) => {
        console.error('❌ MSG91 failure:', error);
        onFailure(error);
      }
    };

    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (window.initSendOTP) {
        console.log("🚀 Initializing MSG91 OTP Widget...");
        window.initSendOTP(configuration);
        clearInterval(interval);
      } else if (attempts > 20) {
        console.error("🕒 MSG91 script failed to load after 10 seconds.");
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [onSuccess, onFailure]);

  const sendOtp = useCallback((identifier: string) => {
    if (window.sendOtp) {
      console.log(`📤 Sending OTP to: ${identifier}`);
      window.sendOtp(identifier);
    } else {
      console.warn("⚠️ MSG91 sendOtp method not ready. Check if initSendOTP was called successfully.");
    }
  }, []);

  return { sendOtp };
};

