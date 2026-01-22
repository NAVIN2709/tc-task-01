import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TermsAndConditions = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div className="min-h-screen bg-white px-3 py-10 max-w-3xl mx-auto">
      <div className="topbar flex w-fit">
        <div className="back-button mr-2 flex items-center justify-center mb-4" onClick={handleBack}>
          <ArrowLeft />
        </div>
        <h1 className="text-2xl font-bold text-yellow-600 mb-4">
          Terms And Conditions
        </h1>
      </div>

      <section className="space-y-4 text-gray-700 text-sm">
        <p>
          By accessing or using this application, you agree to be bound by these
          Terms and Conditions. If you do not agree with any part of the terms,
          you may not use the app.
        </p>

        <h2 className="font-semibold text-gray-900">1. Purpose of the App</h2>
        <p>
          This app is a college-based platform designed to help users report and
          find lost items within their campus community. The app is intended for
          personal and non-commercial use only.
        </p>

        <h2 className="font-semibold text-gray-900">
          2. User Responsibilities
        </h2>
        <p>
          Users are responsible for the accuracy of the information they submit.
          Any misuse, false reporting, or harmful activity may result in account
          suspension or removal.
        </p>

        <h2 className="font-semibold text-gray-900">3. Content Ownership</h2>
        <p>
          Users retain ownership of the content they submit. However, by posting
          content, you grant us permission to display it within the app for its
          intended purpose.
        </p>

        <h2 className="font-semibold text-gray-900">4. Termination</h2>
        <p>
          We reserve the right to suspend or terminate access to the app at any
          time if these terms are violated.
        </p>

        <h2 className="font-semibold text-gray-900">
          5. Limitation of Liability
        </h2>
        <p>
          We are not responsible for lost items, disputes between users, or any
          damages resulting from the use of the app.
        </p>

        <h2 className="font-semibold text-gray-900">6. Changes to Terms</h2>
        <p>
          These terms may be updated from time to time. Continued use of the app
          indicates acceptance of the updated terms.
        </p>
      </section>
    </div>
  );
};

export default TermsAndConditions;
