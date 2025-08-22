"use client";

import {
  Authenticated,
  Unauthenticated,
  useQuery
} from "convex/react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { api } from "../convex/_generated/api";
import siteConfig from "../site-config";
import { SignInForm } from "./auth/SignInForm";
import { Header } from "./components/Header";
import { TabNavigation } from "./components/TabNavigation";
import Home from "./home/Home";
import { ProfileManagement } from "./profile/ProfileManagement";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Header />
      {/* Mobile Tab Navigation - only show on small screens */}
      <div className="md:hidden">
        <Authenticated>
          <TabNavigation variant="standalone" />
        </Authenticated>
      </div>
      <main className="flex-1 p-2 md:p-8">
        <Content />
      </main>
      <Toaster />
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.users.getUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Authenticated>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Authenticated>

      <Unauthenticated>
        <div className="max-w-md mx-auto md:max-w-lg">
          <div className="text-center p-4">
            <p className="text-xl text-accent-foreground">{siteConfig.siteDescription}</p>
          </div>
          <SignInForm />
        </div>
      </Unauthenticated>
    </div>
  );
}

function HomePage() {
  return (
    <Home />
  );
}

function ProfilePage() {
  return <ProfileManagement />;
}
