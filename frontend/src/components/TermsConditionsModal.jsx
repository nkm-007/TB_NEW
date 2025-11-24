export default function TermsConditionsModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-900 to-black border border-purple-500 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-gradient-to-r from-purple-900 to-black p-6 border-b border-purple-500 border-opacity-30">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-black">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Terms & Conditions
              </span>
            </h2>
            <button
              onClick={onClose}
              className="text-3xl text-gray-400 hover:text-white transition"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 text-gray-300 space-y-6">
          <section>
            <h3 className="text-xl font-bold text-purple-400 mb-3">
              1. Acceptance of Terms
            </h3>
            <p className="text-sm leading-relaxed">
              By accessing and using TeaG ("the Service"), you accept and agree
              to be bound by these Terms and Conditions. If you do not agree to
              these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-purple-400 mb-3">
              2. Service Description
            </h3>
            <p className="text-sm leading-relaxed mb-2">
              TeaG is a location-based social platform that helps users connect
              with people nearby for casual meetups over tea or food. Our
              service includes:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-4">
              <li>Location-based user discovery within 1KM radius</li>
              <li>Real-time chat functionality</li>
              <li>Interest and preference matching</li>
              <li>Automatic message deletion after 1 hour of inactivity</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-purple-400 mb-3">
              3. Data Collection & Privacy
            </h3>
            <p className="text-sm leading-relaxed mb-2">
              By using TeaG, you agree to share the following information:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-4">
              <li>
                <strong>Location data:</strong> Your real-time location to find
                nearby users
              </li>
              <li>
                <strong>Profile information:</strong> Name, profession,
                interests, and preferences
              </li>
              <li>
                <strong>Usage data:</strong> Chat history (auto-deleted after 1
                hour), availability status
              </li>
              <li>
                <strong>Account data:</strong> Email address for authentication
              </li>
            </ul>
            <p className="text-sm leading-relaxed mt-2">
              We DO NOT sell your data to third parties. Your information is
              used solely to provide and improve our service.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-purple-400 mb-3">
              4. User Conduct
            </h3>
            <p className="text-sm leading-relaxed mb-2">You agree to:</p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-4">
              <li>Provide accurate and truthful information</li>
              <li>Respect other users and maintain appropriate conduct</li>
              <li>Not use the service for illegal activities</li>
              <li>Not harass, abuse, or harm other users</li>
              <li>Not impersonate others or create fake profiles</li>
              <li>Meet in public places for safety</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-purple-400 mb-3">
              5. Safety Guidelines
            </h3>
            <ul className="list-disc list-inside text-sm space-y-1 ml-4">
              <li>Always meet in public, well-lit locations</li>
              <li>Inform a friend or family member about your meetup</li>
              <li>Trust your instincts - if something feels wrong, leave</li>
              <li>Do not share sensitive personal information</li>
              <li>Report inappropriate behavior immediately</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-purple-400 mb-3">
              6. Automatic Data Deletion
            </h3>
            <p className="text-sm leading-relaxed">
              All chat messages are automatically deleted after 1 hour of
              inactivity to protect your privacy. Availability comments are
              deleted after 1 hour. We do not store long-term message history.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-purple-400 mb-3">
              7. Prohibited Content
            </h3>
            <p className="text-sm leading-relaxed">
              You may not post or share content that is illegal, offensive,
              discriminatory, sexually explicit, or violates others' rights.
              Violation may result in immediate account termination.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-purple-400 mb-3">
              8. Disclaimer
            </h3>
            <p className="text-sm leading-relaxed">
              TeaG is a platform for connecting people. We are not responsible
              for interactions between users. Use the service at your own risk
              and exercise caution when meeting people in person.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-purple-400 mb-3">
              9. Age Requirement
            </h3>
            <p className="text-sm leading-relaxed">
              You must be at least 18 years old to use TeaG. By creating an
              account, you confirm that you meet this requirement.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-purple-400 mb-3">
              10. Changes to Terms
            </h3>
            <p className="text-sm leading-relaxed">
              We reserve the right to modify these terms at any time. Continued
              use of the service after changes constitutes acceptance of the new
              terms.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-purple-400 mb-3">
              11. Account Termination
            </h3>
            <p className="text-sm leading-relaxed">
              We reserve the right to suspend or terminate accounts that violate
              these terms or engage in harmful behavior.
            </p>
          </section>

          <div className="mt-8 p-4 bg-purple-500 bg-opacity-10 border border-purple-500 rounded-xl">
            <p className="text-sm text-purple-200">
              <strong>Last Updated:</strong> November 2024
            </p>
            <p className="text-sm text-purple-200 mt-2">
              For questions or concerns, please contact us through the feedback
              feature in the app.
            </p>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gradient-to-r from-purple-900 to-black p-6 border-t border-purple-500 border-opacity-30">
          <button
            onClick={onClose}
            className="w-full p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-lg shadow-lg hover:shadow-purple-500/50 transition transform hover:scale-105"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
