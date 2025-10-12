import { useEffect, useState } from "react";

export default function Dashboard() {
  const [showPopup, setShowPopup] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);

    // only show popup if signed up (flag stored in localStorage)
    if (userData?.isNewUser) {
      setShowPopup(true);
    }
  }, []);

  const handleSubmitProfile = () => {
    // store user profile (you can integrate Firestore here)
    setShowPopup(false);
    const userData = { ...user, isNewUser: false };
    localStorage.setItem("user", JSON.stringify(userData));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h2 className="text-3xl font-bold mb-4">Dashboard</h2>
      <p className="text-gray-400">You are now logged in to TeaChat ☕</p>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg w-11/12 max-w-md text-left">
            <h3 className="text-lg mb-4 font-semibold">
              Complete your profile
            </h3>

            <form className="space-y-3">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full p-2 bg-black border border-gray-600 rounded"
              />

              <select className="w-full p-2 bg-black border border-gray-600 rounded">
                <option>Businessman</option>
                <option>Student</option>
                <option>Corporate</option>
                <option>Freelancer</option>
                <option>Artist</option>
              </select>

              <select className="w-full p-2 bg-black border border-gray-600 rounded">
                <option>Movies</option>
                <option>Sports</option>
                <option>Technology</option>
                <option>Travel</option>
                <option>Music</option>
                <option>Food</option>
              </select>

              <button
                type="button"
                onClick={handleSubmitProfile}
                className="w-full bg-white text-black p-2 rounded font-semibold hover:bg-gray-300"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
