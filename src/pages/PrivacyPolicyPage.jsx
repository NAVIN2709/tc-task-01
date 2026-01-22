import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicies = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div className="min-h-screen bg-white px-3 py-10 max-w-3xl mx-auto">
      <div className="topbar flex items-center">
        <div className="back-button flex items-center justify-center mr-2 mb-4" onClick={handleBack}>
          <ArrowLeft />
        </div>
        <h1 className="text-2xl font-bold text-yellow-600 mb-4">
          Privacy Policy
        </h1>
      </div>

      <section className="space-y-4 text-gray-700 text-sm">
        <p>
          Your privacy is important to us. This Privacy Policy explains how we
          collect, use, and protect your information when you use our app.
        </p>

        <h2 className="font-semibold text-gray-900">
          1. Information We Collect
        </h2>
        <p>
          We may collect basic user information such as username, email address,
          and content submitted within the app (e.g., item details and images).
        </p>

        <h2 className="font-semibold text-gray-900">
          2. How We Use Information
        </h2>
        <p>
          Collected information is used solely to provide core app
          functionality, improve user experience, and maintain platform safety.
        </p>

        <h2 className="font-semibold text-gray-900">3. Data Sharing</h2>
        <p>
          We do not sell, trade, or rent users’ personal information to third
          parties. Data may be stored securely using third-party services such
          as Firebase.
        </p>

        <h2 className="font-semibold text-gray-900">4. Data Security</h2>
        <p>
          We take reasonable measures to protect your data. However, no method
          of electronic storage is 100% secure.
        </p>

        <h2 className="font-semibold text-gray-900">5. User Control</h2>
        <p>
          Users may edit or delete their content at any time. Account access can
          be terminated by signing out or discontinuing use of the app.
        </p>

        <h2 className="font-semibold text-gray-900">6. Children’s Privacy</h2>
        <p>
          This app is not intended for children under the age of 13. We do not
          knowingly collect personal information from children.
        </p>

        <h2 className="font-semibold text-gray-900">
          7. Changes to This Policy
        </h2>
        <p>
          This Privacy Policy may be updated periodically. Continued use of the
          app indicates acceptance of the updated policy.
        </p>

        <h2 className="font-semibold text-gray-900">8. Contact Us</h2>
        <p>
          If you have any questions regarding this Privacy Policy, please
          contact us at:
          <br />
          📧{" "}
          <a
            href="mailto:navinnitt2006@gmail.com"
            className="text-yellow-600 underline"
          >
            navinnitt2006@gmail.com
          </a>
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicies;
