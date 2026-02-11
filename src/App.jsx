import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Chats from "./pages/Chats";
import Profile from "./pages/Profile";
import Newplace from "./pages/components/Newplace";
import ChatDetail from "../src/chats/[id]";
import Login from "./pages/Login";
import PrivateRoute from "./pages/components/PrivateRoute";
import Onboarding from "./pages/Onboarding";
import Items from "./pages/Items";
import CollgeInvitePage from "./pages/CollegeInvite";
import TermsAndConditions from "./pages/TermsAndConditionsPage"
import PrivacyPolicies from "./pages/PrivacyPolicyPage"
import InstallPromptModal from "./pages/components/InstallPromptModal";
import OpenInBrowser from "./pages/OpenInBrowser";

const App = () => {
  return (
    <BrowserRouter>
    <InstallPromptModal />
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/invite/:name" element={<CollgeInvitePage />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/open" element={<OpenInBrowser />} />
        <Route path="/privacy-policies" element={<PrivacyPolicies />} />
        

        {/* Protected Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/items" element={<Items />} />
        <Route
          path="/chats"
          element={
            <PrivateRoute>
              <Chats />
            </PrivateRoute>
          }
        />
        <Route
          path="/chats/:id"
          element={
            <PrivateRoute>
              <ChatDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/newplace"
          element={
            <PrivateRoute>
              <Newplace />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
