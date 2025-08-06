"use client";

import { SelectedPetProvider } from "../context/SelectedPetContext";
import Header from "../activity/components/ActivityHeader";

export default function SnsLayout({ children }) {
  return (
    <SelectedPetProvider>
      <Header />
      <main>{children}</main>
    </SelectedPetProvider>
  );
}
