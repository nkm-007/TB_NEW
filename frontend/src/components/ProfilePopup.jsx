// import { useState, useEffect } from "react";
// import API from "../services/api";

// export default function ProfilePopup({ onClose, onComplete }) {
//   const [name, setName] = useState("");
//   const [profession, setProfession] = useState("");
//   const [professionDetails, setProfessionDetails] = useState("");
//   const [selectedInterests, setSelectedInterests] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [dataLoading, setDataLoading] = useState(true); // NEW: Loading state for data fetch

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
//     loadUserData();
//   }, []);

//   const loadUserData = async () => {
//     setDataLoading(true);
//     const token = localStorage.getItem("token");

//     if (!token) {
//       setDataLoading(false);
//       return;
//     }

//     try {
//       const { data } = await API.get("/profile/me", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (data.user) {
//         setName(data.user.name || "");
//         setProfession(data.user.profession || "");
//         setProfessionDetails(data.user.professionDetails || "");
//         setSelectedInterests(data.user.interests || []);
//         setIsEditing(!!data.user.profileCompleted);
//       }
//     } catch (err) {
//       console.error("Error loading user data:", err);
//     } finally {
//       setDataLoading(false);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!name || !profession || selectedInterests.length === 0) {
//       alert("Please fill all required fields");
//       return;
//     }

//     if (profession !== "Other" && !professionDetails) {
//       alert("Please provide profession details");
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
//         { name, profession, professionDetails, interests: selectedInterests },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       alert(
//         isEditing
//           ? "Profile updated successfully!"
//           : "Profile saved successfully!"
//       );

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

//   const getProfessionDetailsPlaceholder = () => {
//     switch (profession) {
//       case "Corporate Employee":
//         return "Company name (e.g., Google, Microsoft)";
//       case "Student":
//         return "College/University name (e.g., IIT Delhi)";
//       case "Businessman":
//         return "Business type (e.g., Restaurant, E-commerce)";
//       case "Freelancer":
//         return "Your specialization (e.g., Web Developer)";
//       case "Teacher":
//         return "Subject/Institution (e.g., Math, ABC School)";
//       case "Doctor":
//         return "Specialization (e.g., Cardiologist)";
//       case "Engineer":
//         return "Field (e.g., Software, Mechanical)";
//       case "Artist":
//         return "Art form (e.g., Painting, Music)";
//       default:
//         return "Details about your profession";
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

//           {/* Loading State */}
//           {dataLoading ? (
//             <div className="flex flex-col items-center justify-center py-12">
//               <div className="animate-spin text-6xl mb-4">🔄</div>
//               <p className="text-gray-400">Loading your profile...</p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               <div>
//                 <label className="block mb-2 text-sm font-semibold text-gray-300">
//                   Your Name
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter your name"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className="w-full p-4 bg-black border border-purple-500 border-opacity-30 rounded-xl focus:outline-none focus:border-purple-500 text-white"
//                 />
//               </div>

//               <div>
//                 <label className="block mb-2 text-sm font-semibold text-gray-300">
//                   Profession
//                 </label>
//                 <select
//                   value={profession}
//                   onChange={(e) => {
//                     setProfession(e.target.value);
//                     setProfessionDetails("");
//                   }}
//                   className="w-full p-4 bg-black border border-purple-500 border-opacity-30 rounded-xl focus:outline-none focus:border-purple-500 text-white"
//                 >
//                   <option value="">Select Profession</option>
//                   {professions.map((p) => (
//                     <option key={p} value={p}>
//                       {p}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {profession && profession !== "Other" && (
//                 <div>
//                   <label className="block mb-2 text-sm font-semibold text-gray-300">
//                     {profession === "Corporate Employee" && "Company Name"}
//                     {profession === "Student" && "College/University"}
//                     {profession === "Businessman" && "Business Type"}
//                     {profession === "Freelancer" && "Specialization"}
//                     {profession === "Teacher" && "Subject/Institution"}
//                     {profession === "Doctor" && "Specialization"}
//                     {profession === "Engineer" && "Field"}
//                     {profession === "Artist" && "Art Form"}
//                   </label>
//                   <input
//                     type="text"
//                     placeholder={getProfessionDetailsPlaceholder()}
//                     value={professionDetails}
//                     onChange={(e) => setProfessionDetails(e.target.value)}
//                     className="w-full p-4 bg-black border border-purple-500 border-opacity-30 rounded-xl focus:outline-none focus:border-purple-500 text-white"
//                   />
//                 </div>
//               )}

//               <div>
//                 <label className="block mb-2 text-sm font-semibold text-gray-300">
//                   Interests (Select multiple)
//                 </label>
//                 <div className="grid grid-cols-2 gap-2">
//                   {interests.map((i) => (
//                     <button
//                       key={i}
//                       onClick={() => {
//                         if (selectedInterests.includes(i)) {
//                           setSelectedInterests(
//                             selectedInterests.filter((int) => int !== i)
//                           );
//                         } else {
//                           setSelectedInterests([...selectedInterests, i]);
//                         }
//                       }}
//                       className={`p-3 rounded-xl text-sm font-semibold transition ${
//                         selectedInterests.includes(i)
//                           ? "bg-purple-600 text-white border-2 border-purple-400"
//                           : "bg-black border border-purple-500 border-opacity-30 text-gray-400"
//                       }`}
//                     >
//                       {i}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <button
//                 onClick={handleSubmit}
//                 disabled={loading}
//                 className="w-full mt-6 p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-lg shadow-lg hover:shadow-purple-500/50 transition disabled:opacity-50 transform hover:scale-105 flex items-center justify-center gap-2"
//               >
//                 {loading && <span className="animate-spin">🔄</span>}
//                 {loading
//                   ? "Saving..."
//                   : isEditing
//                   ? "Update Profile"
//                   : "Save Profile"}
//               </button>

//               {isEditing && (
//                 <button
//                   onClick={onClose}
//                   className="w-full mt-3 p-3 bg-gray-700 rounded-xl font-semibold hover:bg-gray-600 transition"
//                 >
//                   Cancel
//                 </button>
//               )}
//             </div>
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
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

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
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setDataLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      setDataLoading(false);
      return;
    }

    try {
      const { data } = await API.get("/profile/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.user) {
        // Set all fields with proper fallbacks
        setName(data.user.name || "");
        setProfession(data.user.profession || "");
        // CRITICAL: Always preserve professionDetails
        setProfessionDetails(data.user.professionDetails || "");

        // Handle interests (both old single and new multiple format)
        if (data.user.interests && data.user.interests.length > 0) {
          setSelectedInterests(data.user.interests);
        } else if (data.user.interest) {
          setSelectedInterests([data.user.interest]);
        }

        setIsEditing(!!data.user.profileCompleted);

        console.log("Loaded user data:", {
          name: data.user.name,
          profession: data.user.profession,
          professionDetails: data.user.professionDetails,
          interests: data.user.interests,
        });
      }
    } catch (err) {
      console.error("Error loading user data:", err);
      alert("Failed to load profile data. Please try again.");
    } finally {
      setDataLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!name || !name.trim()) {
      alert("Please enter your name");
      return;
    }

    if (!profession) {
      alert("Please select a profession");
      return;
    }

    if (selectedInterests.length === 0) {
      alert("Please select at least one interest");
      return;
    }

    // CRITICAL: Validate professionDetails for non-"Other" professions
    if (
      profession !== "Other" &&
      (!professionDetails || !professionDetails.trim())
    ) {
      alert(
        `Please provide details about your ${profession.toLowerCase()} profession`
      );
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login again");
      //navigate("/login");
      return;
    }

    setLoading(true);
    try {
      // Prepare data payload - ALWAYS include professionDetails
      const payload = {
        name: name.trim(),
        profession,
        professionDetails: professionDetails.trim(), // Always send this
        interests: selectedInterests,
      };

      console.log("Saving profile with payload:", payload);

      const { data } = await API.post("/profile/save", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Profile save response:", data);

      // Update localStorage with complete user data
      const updatedUser = {
        ...data.user,
        isNewUser: false,
        // Ensure professionDetails is in localStorage
        professionDetails:
          data.user.professionDetails || professionDetails.trim(),
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert(
        isEditing
          ? "Profile updated successfully! ✅"
          : "Profile saved successfully! ✅"
      );

      // Verify data was saved by fetching again
      const verifyResponse = await API.get("/profile/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Verified saved data:", verifyResponse.data.user);

      onComplete(updatedUser);
    } catch (err) {
      console.error("Profile save error:", err);
      alert(
        err.response?.data?.msg || "Error saving profile. Please try again."
      );
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

  const getProfessionDetailsLabel = () => {
    switch (profession) {
      case "Corporate Employee":
        return "Company Name *";
      case "Student":
        return "College/University *";
      case "Businessman":
        return "Business Type *";
      case "Freelancer":
        return "Specialization *";
      case "Teacher":
        return "Subject/Institution *";
      case "Doctor":
        return "Specialization *";
      case "Engineer":
        return "Field *";
      case "Artist":
        return "Art Form *";
      default:
        return "Profession Details *";
    }
  };

  const handleToggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
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

          {/* Loading State */}
          {dataLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin text-6xl mb-4">🔄</div>
              <p className="text-gray-400">Loading your profile...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-300">
                  Your Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-4 bg-black border border-purple-500 border-opacity-30 rounded-xl focus:outline-none focus:border-purple-500 text-white placeholder-gray-500"
                />
              </div>

              {/* Profession Field */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-300">
                  Profession *
                </label>
                <select
                  value={profession}
                  onChange={(e) => {
                    const newProfession = e.target.value;
                    setProfession(newProfession);
                    // Don't clear professionDetails if changing back to same profession
                    if (newProfession === "Other") {
                      setProfessionDetails("");
                    }
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

              {/* Profession Details Field - ALWAYS shown except for "Other" */}
              {profession && profession !== "Other" && (
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-300 flex items-center gap-2">
                    {getProfessionDetailsLabel()}
                    <span className="text-xs text-red-400">(Required)</span>
                  </label>
                  <input
                    type="text"
                    placeholder={getProfessionDetailsPlaceholder()}
                    value={professionDetails}
                    onChange={(e) => setProfessionDetails(e.target.value)}
                    className="w-full p-4 bg-black border border-purple-500 border-opacity-30 rounded-xl focus:outline-none focus:border-purple-500 text-white placeholder-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This helps others know more about you
                  </p>
                </div>
              )}

              {/* Interests Field */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-300">
                  Interests *{" "}
                  <span className="text-xs text-gray-500">
                    (Select multiple)
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {interests.map((i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleToggleInterest(i)}
                      className={`p-3 rounded-xl text-sm font-semibold transition-all ${
                        selectedInterests.includes(i)
                          ? "bg-purple-600 text-white border-2 border-purple-400 shadow-lg"
                          : "bg-black border border-purple-500 border-opacity-30 text-gray-400 hover:border-purple-400 hover:text-white"
                      }`}
                    >
                      {selectedInterests.includes(i) && "✓ "}
                      {i}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Selected: {selectedInterests.length} interest
                  {selectedInterests.length !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full mt-6 p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-lg shadow-lg hover:shadow-purple-500/50 transition disabled:opacity-50 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                {loading && <span className="animate-spin">🔄</span>}
                {loading
                  ? "Saving..."
                  : isEditing
                  ? "Update Profile"
                  : "Save Profile"}
              </button>

              {/* Cancel Button (only when editing) */}
              {isEditing && (
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="w-full mt-3 p-3 bg-gray-700 rounded-xl font-semibold hover:bg-gray-600 transition disabled:opacity-50"
                >
                  Cancel
                </button>
              )}

              {/* Required Fields Notice */}
              <div className="mt-4 p-3 bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-30 rounded-xl">
                <p className="text-xs text-yellow-200">
                  * All fields marked with asterisk are required
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
