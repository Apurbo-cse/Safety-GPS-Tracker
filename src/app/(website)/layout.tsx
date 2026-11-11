import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import MobilePageBar from "@/components/layout/MobilePageBar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import DeviceModal from "@/components/devices/DeviceModal";
import FeatureModal from "@/components/features/FeatureModal";
import FloatingActions from "@/components/layout/FloatingActions";
import CommandPalette from "@/components/layout/CommandPalette";
import BottomNav from "@/components/layout/BottomNav";
import MoreSheet from "@/components/layout/MoreSheet";
import PlanFeaturesModal from "@/components/pricing/PlanFeaturesModal";
import LeadModal from "@/components/forms/LeadModal";

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopBar />
      <Navbar />
      <MobilePageBar />
      <div className="pb-[calc(3.6rem+env(safe-area-inset-bottom))] lg:pb-0">
        <main id="main">{children}</main>
        <Footer />
      </div>
      <CartDrawer />
      <DeviceModal />
      <FeatureModal />
      <LeadModal />
      <PlanFeaturesModal />
      <BottomNav />
      <MoreSheet />
      <FloatingActions />
      <CommandPalette />
    </>
  );
}
