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

  useEffect(() => {
    const configuration = {
      widgetId: WIDGET_ID,
      tokenAuth: "395689T4cE12EIGpi69e4eb08P1", // This is usually handled by MSG91 internally via widgetId but can be added if needed
      exposeMethods: true,
      success: (data: any) => {
        console.log('MSG91 Success:', data);
        onSuccess(data);
      },
      failure: (error: any) => {
        console.log('MSG91 Failure:', error);
        onFailure(error);
      }
    };

    const interval = setInterval(() => {
      if (window.initSendOTP) {
        window.initSendOTP(configuration);
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [onSuccess, onFailure]);

  const sendOtp = useCallback((identifier: string) => {
    if (window.sendOtp) {
      window.sendOtp(identifier);
    } else {
      console.warn("MSG91 sendOtp method not ready");
    }
  }, []);

  return { sendOtp };
};
