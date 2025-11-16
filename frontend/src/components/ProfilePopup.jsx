// import { useState, useEffect } from "react";
// import API from "../services/api";

// export default function ProfilePopup({ onClose, onComplete }) {
//   const [name, setName] = useState("");
//   const [profession, setProfession] = useState("");
//   const [interest, setInterest] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);

//   const professions = [
//     "Businessman",
//     "Student",
//     "Corporate Employee",
//     "Freelancer",
//     "Teacher",
//     "Doctor",
//     "Engineer",
//     "Artist",
//     "Other",
//   ];

//   const interests = [
//     "Movies",
//     "Sports",
//     "Music",
//     "Technology",
//     "Travel",
//     "Gaming",
//     "Books",
//     "Food",
//     "Fitness",
//     "Business",
//   ];

//   useEffect(() => {
//     // Load existing user data
//     const loadUserData = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) return;

//       try {
//         const { data } = await API.get("/profile/me", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (data.user) {
//           setName(data.user.name || "");
//           setProfession(data.user.profession || "");
//           setInterest(data.user.interest || "");
//           setIsEditing(!!data.user.profileCompleted);
//         }
//       } catch (err) {
//         console.error("Error loading user data:", err);
//       }
//     };

//     loadUserData();
//   }, []);

//   const handleSubmit = async () => {
//     if (!name || !profession || !interest) {
//       alert("Please fill all fields");
//       return;
//     }

//     const token = localStorage.getItem("token");
//     if (!token) {
//       alert("Please login again");
//       return;
//     }

//     setLoading(true);
//     try {
//       const { data } = await API.post(
//         "/profile/save",
//         { name, profession, interest },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       alert(
//         isEditing
//           ? "Profile updated successfully!"
//           : "Profile saved successfully!"
//       );

//       // Update user in localStorage
//       const updatedUser = { ...data.user, isNewUser: false };
//       localStorage.setItem("user", JSON.stringify(updatedUser));

//       onComplete(updatedUser);
//     } catch (err) {
//       console.error("Profile save error:", err);
//       alert(err.response?.data?.msg || "Error saving profile");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
//       <div className="bg-gradient-to-br from-purple-900 to-black border border-purple-500 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
//         <div className="p-6">
//           <h2 className="text-3xl font-black mb-2">
//             <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
//               {isEditing ? "Edit Profile" : "Complete Your Profile"}
//             </span>
//           </h2>
//           <p className="text-gray-400 mb-6 text-sm">
//             {isEditing
//               ? "Update your information below"
//               : "Tell us a bit about yourself"}
//           </p>

//           <div className="space-y-4">
//             <div>
//               <label className="block mb-2 text-sm font-semibold text-gray-300">
//                 Your Name
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter your name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="w-full p-4 bg-black border border-purple-500 border-opacity-30 rounded-xl focus:outline-none focus:border-purple-500 text-white"
//               />
//             </div>

//             <div>
//               <label className="block mb-2 text-sm font-semibold text-gray-300">
//                 Profession
//               </label>
//               <select
//                 value={profession}
//                 onChange={(e) => setProfession(e.target.value)}
//                 className="w-full p-4 bg-black border border-purple-500 border-opacity-30 rounded-xl focus:outline-none focus:border-purple-500 text-white"
//               >
//                 <option value="">Select Profession</option>
//                 {professions.map((p) => (
//                   <option key={p} value={p}>
//                     {p}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block mb-2 text-sm font-semibold text-gray-300">
//                 Interest to Talk About
//               </label>
//               <select
//                 value={interest}
//                 onChange={(e) => setInterest(e.target.value)}
//                 className="w-full p-4 bg-black border border-purple-500 border-opacity-30 rounded-xl focus:outline-none focus:border-purple-500 text-white"
//               >
//                 <option value="">Select Interest</option>
//                 {interests.map((i) => (
//                   <option key={i} value={i}>
//                     {i}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className="w-full mt-6 p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-lg shadow-lg hover:shadow-purple-500/50 transition disabled:opacity-50 transform hover:scale-105"
//           >
//             {loading
//               ? "Saving..."
//               : isEditing
//               ? "Update Profile"
//               : "Save Profile"}
//           </button>

//           {isEditing && (
//             <button
//               onClick={onClose}
//               className="w-full mt-3 p-3 bg-gray-700 rounded-xl font-semibold hover:bg-gray-600 transition"
//             >
//               Cancel
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import API from "../services/api";

export default function ProfilePopup({ onClose, onComplete }) {
  const [name, setName] = useState("");
  const [profession, setProfession] = useState("");
  const [professionDetails, setProfessionDetails] = useState("");
  const [interest, setInterest] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const professions = [
    "Businessman",
    "Student",
    "Corporate Employee",
    "Freelancer",
    "Teacher",
    "Doctor",
    "Engineer",
    "Artist",
    "Other",
  ];

  const interests = [
    "Movies",
    "Sports",
    "Music",
    "Technology",
    "Travel",
    "Gaming",
    "Books",
    "Food",
    "Fitness",
    "Business",
  ];

  useEffect(() => {
    // Load existing user data
    const loadUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const { data } = await API.get("/profile/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.user) {
          setName(data.user.name || "");
          setProfession(data.user.profession || "");
          setProfessionDetails(data.user.professionDetails || "");
          setInterest(data.user.interest || "");
          setIsEditing(!!data.user.profileCompleted);
        }
      } catch (err) {
        console.error("Error loading user data:", err);
      }
    };

    loadUserData();
  }, []);

  const handleSubmit = async () => {
    if (!name || !profession || !interest) {
      alert("Please fill all required fields");
      return;
    }

    if (profession !== "Other" && !professionDetails) {
      alert("Please provide profession details");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login again");
      return;
    }

    setLoading(true);
    try {
      const { data } = await API.post(
        "/profile/save",
        { name, profession, professionDetails, interest },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(
        isEditing
          ? "Profile updated successfully!"
          : "Profile saved successfully!"
      );

      // Update user in localStorage
      const updatedUser = { ...data.user, isNewUser: false };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      onComplete(updatedUser);
    } catch (err) {
      console.error("Profile save error:", err);
      alert(err.response?.data?.msg || "Error saving profile");
    } finally {
      setLoading(false);
    }
  };

  const getProfessionDetailsPlaceholder = () => {
    switch (profession) {
      case "Corporate Employee":
        return "Company name (e.g., Google, Microsoft)";
      case "Student":
        return "College/University name (e.g., IIT Delhi)";
      case "Businessman":
        return "Business type (e.g., Restaurant, E-commerce)";
      case "Freelancer":
        return "Your specialization (e.g., Web Developer)";
      case "Teacher":
        return "Subject/Institution (e.g., Math, ABC School)";
      case "Doctor":
        return "Specialization (e.g., Cardiologist)";
      case "Engineer":
        return "Field (e.g., Software, Mechanical)";
      case "Artist":
        return "Art form (e.g., Painting, Music)";
      default:
        return "Details about your profession";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-900 to-black border border-purple-500 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
          <h2 className="text-3xl font-black mb-2">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {isEditing ? "Edit Profile" : "Complete Your Profile"}
            </span>
          </h2>
          <p className="text-gray-400 mb-6 text-sm">
            {isEditing
              ? "Update your information below"
              : "Tell us a bit about yourself"}
          </p>

          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-300">
                Your Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 bg-black border border-purple-500 border-opacity-30 rounded-xl focus:outline-none focus:border-purple-500 text-white"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-300">
                Profession
              </label>
              <select
                value={profession}
                onChange={(e) => {
                  setProfession(e.target.value);
                  setProfessionDetails(""); // Reset details when profession changes
                }}
                className="w-full p-4 bg-black border border-purple-500 border-opacity-30 rounded-xl focus:outline-none focus:border-purple-500 text-white"
              >
                <option value="">Select Profession</option>
                {professions.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Profession Details */}
            {profession && profession !== "Other" && (
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-300">
                  {profession === "Corporate Employee" && "Company Name"}
                  {profession === "Student" && "College/University"}
                  {profession === "Businessman" && "Business Type"}
                  {profession === "Freelancer" && "Specialization"}
                  {profession === "Teacher" && "Subject/Institution"}
                  {profession === "Doctor" && "Specialization"}
                  {profession === "Engineer" && "Field"}
                  {profession === "Artist" && "Art Form"}
                </label>
                <input
                  type="text"
                  placeholder={getProfessionDetailsPlaceholder()}
                  value={professionDetails}
                  onChange={(e) => setProfessionDetails(e.target.value)}
                  className="w-full p-4 bg-black border border-purple-500 border-opacity-30 rounded-xl focus:outline-none focus:border-purple-500 text-white"
                />
              </div>
            )}

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-300">
                Interest to Talk About
              </label>
              <select
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                className="w-full p-4 bg-black border border-purple-500 border-opacity-30 rounded-xl focus:outline-none focus:border-purple-500 text-white"
              >
                <option value="">Select Interest</option>
                {interests.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-6 p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-lg shadow-lg hover:shadow-purple-500/50 transition disabled:opacity-50 transform hover:scale-105"
          >
            {loading
              ? "Saving..."
              : isEditing
              ? "Update Profile"
              : "Save Profile"}
          </button>

          {isEditing && (
            <button
              onClick={onClose}
              className="w-full mt-3 p-3 bg-gray-700 rounded-xl font-semibold hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
