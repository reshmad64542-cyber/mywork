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

  return (
    <>
      {shouldShowLayout && (isAuthenticated ? <AuthenticatedHeader /> : <Header />)}
      <main className={shouldShowLayout ? "min-h-screen" : ""}>
        {children}
      </main>
      {shouldShowLayout && !isAuthenticated && <Footer />}
    </>
  );
}