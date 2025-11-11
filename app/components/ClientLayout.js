"use client";
import { usePathname } from "next/navigation";
import Header from "./Header";
import AuthenticatedHeader from "./AuthenticatedHeader";
import Footer from "./Footer";
import { useAuth } from "../context/AuthContext";

export default function ClientLayout({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const pathname = usePathname();

  // Routes that should not show any header/footer
  const noLayoutRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
  const shouldShowLayout = !noLayoutRoutes.includes(pathname);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (shouldShowLayout) {
    return (
      <div className="min-h-screen flex flex-col">
        {isAuthenticated ? <AuthenticatedHeader /> : <Header />}
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      {shouldShowLayout && (isAuthenticated ? <AuthenticatedHeader /> : <Header />)}
      <main className={shouldShowLayout ? "flex-1" : ""}>
        {children}
      </main>
      {shouldShowLayout && <Footer />}
    </>
  );
}