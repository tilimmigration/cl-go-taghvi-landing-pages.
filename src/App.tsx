import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import TalentVisaChecklist from "./pages/TalentVisaChecklist.tsx";
import TalentVisaChecklistThankYou from "./pages/TalentVisaChecklistThankYou.tsx";
import TalentVisaSubmitCaseInfo from "./pages/TalentVisaSubmitCaseInfo.tsx";
import ThankYou from "./pages/ThankYou.tsx";
import BookCaseEvaluation from "./pages/BookCaseEvaluation.tsx";
import CaseStudyFamily from "./pages/CaseStudyFamily.tsx";
import CaseStudyEmployment from "./pages/CaseStudyEmployment.tsx";
import CaseStudyRemoval from "./pages/CaseStudyRemoval.tsx";
import CookiePolicy from "./pages/CookiePolicy.tsx";
import DoNotSell from "./pages/DoNotSell.tsx";
import CCPAInfo from "./pages/CCPAInfo.tsx";
import SitemapPage from "./pages/Sitemap.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import AccessibilityPanel from "@/components/AccessibilityPanel";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/family-based-quiz" element={<Index />} />
          <Route path="/family-based-quiz-thank-you" element={<ThankYou />} />
          <Route path="/family-based-quiz-book-your-case-evaluation" element={<BookCaseEvaluation />} />
          <Route path="/talent-visa-checklist" element={<TalentVisaChecklist />} />
          <Route path="/talent-visa-checklist-thank-you" element={<TalentVisaChecklistThankYou />} />
          <Route path="/talent-visa-submit-your-case-information" element={<TalentVisaSubmitCaseInfo />} />
          <Route path="/case-studies" element={<Navigate to="/case-studies/family-immigration" replace />} />
          <Route path="/case-studies/family-immigration" element={<CaseStudyFamily />} />
          <Route path="/case-studies/employment-talent" element={<CaseStudyEmployment />} />
          <Route path="/case-studies/removal-defense-asylum" element={<CaseStudyRemoval />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/do-not-sell-my-info" element={<DoNotSell />} />
          <Route path="/ccpa" element={<CCPAInfo />} />
          <Route path="/sitemap" element={<SitemapPage />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <AccessibilityPanel />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
