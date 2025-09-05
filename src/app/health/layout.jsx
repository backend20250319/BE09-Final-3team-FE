"use client";

import { SelectedPetProvider } from "./context/SelectedPetContext";
import Header from "./components/HealthHeader";

export default function HealthLayout({ children }) {
  return (
    <SelectedPetProvider>
      <Header />
      <main>{children}</main>
    </SelectedPetProvider>
  );
}
