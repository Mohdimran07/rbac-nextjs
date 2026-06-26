import React from "react";
import Header from "../components/layouts/Header";
import { apiCient } from "../lib/apiClient";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await apiCient.getCurrentUser();
  return (
    <>
      <Header user={user ?? null} />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </>
  );
};

export default MainLayout;
