import { Outlet } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";

function DashboardLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-dim font-inter text-on-surface">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8 sm:px-8 lg:px-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default DashboardLayout;
