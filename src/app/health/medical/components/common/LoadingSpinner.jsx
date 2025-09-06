"use client";

import React from "react";
import { MEDICATION_LABELS, COMMON_MESSAGES } from "../../../constants";

export default function LoadingSpinner({
  message,
  className,
}) {
  const displayMessage = message || COMMON_MESSAGES.LOADING;

  return (
    <div className={className}>
      <div className="loadingSpinner"></div>
      <p>{displayMessage}</p>
    </div>
  );
}
