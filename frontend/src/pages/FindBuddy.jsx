// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../services/api";

// export default function FindBuddy() {
//   const [interest, setInterest] = useState("");
//   const [isEditingInterest, setIsEditingInterest] = useState(false);
//   const [comment, setComment] = useState("");
//   const [isEditingComment, setIsEditingComment] = useState(false);
//   const [location, setLocation] = useState(null);
//   const [finding, setFinding] = useState(false);
//   const [matchedUsers, setMatchedUsers] = useState([]);
//   const [otherUsers, setOtherUsers] = useState([]);
//   const [sentRequests, setSentRequests] = useState(new Set());
//   const navigate = useNavigate();

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
//     const fetchUserData = async () => {
//       const user = JSON.parse(localStorage.getItem("user"));
//       if (user?.interest) {
//         setInterest(user.interest);
//       }

//       // Fetch latest comment from backend
//       const token = localStorage.getItem("token");
//       if (token) {
//         try {
//           const { data } = await API.get("/profile/me", {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           if (data.user.availabilityComment) {
//             setComment(data.user.availabilityComment);
//           }
//         } catch (err) {
//           console.error("Failed to fetch user data:", err);
//         }
//       }
//     };

//     fetchUserData();
//   }, []);

//   const getLocation = () => {
//     return new Promise((resolve, reject) => {
//       if (!navigator.geolocation) {
//         reject(new Error("Geolocation not supported"));
//         return;
//       }

//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           resolve({
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//           });
//         },
//         (error) => {
//           reject(error);
//         }
//       );
//     });
//   };

//   const handleSaveComment = async () => {
//     const token = localStorage.getItem("token");
//     try {
//       await API.put(
//         "/profile/update-comment",
//         { availabilityComment: comment },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setIsEditingComment(false);
//       //alert("Comment saved! It will be visible for 1 hour.");
//     } catch (err) {
//       console.error("Save comment error:", err);
//       alert("Failed to save comment");
//     }
//   };

//   const handleSaveInterest = async () => {
//     if (!interest) {
//       alert("Please select an interest");
//       return;
//     }

//     const token = localStorage.getItem("token");
//     try {
//       const { data } = await API.post(
//         "/profile/save",
//         { interest },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       // Update localStorage
//       const user = JSON.parse(localStorage.getItem("user"));
//       user.interest = interest;
//       localStorage.setItem("user", JSON.stringify(user));

//       setIsEditingInterest(false);
//       //alert("Interest updated!");
//     } catch (err) {
//       console.error("Save interest error:", err);
//       alert("Failed to save interest");
//     }
//   };

//   const handleFindBuddies = async () => {
//     if (!interest) {
//       alert("Please select an interest");
//       return;
//     }

//     setFinding(true);
//     try {
//       // Get current location
//       const loc = await getLocation();
//       setLocation(loc);

//       const token = localStorage.getItem("token");

//       // Update location (don't send comment here, it's already saved)
//       await API.put(
//         "/profile/update-location",
//         {
//           longitude: loc.longitude,
//           latitude: loc.latitude,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       // Find nearby buddies with selected interest
//       const { data } = await API.get("/buddy/find-nearby", {
//         params: {
//           longitude: loc.longitude,
//           latitude: loc.latitude,
//           interest: interest, // Send selected interest
//         },
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setMatchedUsers(data.matchedInterest || []);
//       setOtherUsers(data.otherInterests || []);

//       if (data.totalFound === 0) {
//         alert("No buddies found nearby. Try again later!");
//       }
//     } catch (err) {
//       console.error("Find buddies error:", err);
//       if (err.message?.includes("denied")) {
//         alert("Location permission denied. Please enable location access.");
//       } else {
//         alert(err.response?.data?.msg || "Failed to find buddies");
//       }
//     } finally {
//       setFinding(false);
//     }
//   };

//   const handleSelectBuddy = async (buddy) => {
//     const token = localStorage.getItem("token");

//     try {
//       // Check friend status first
//       const { data } = await API.get(
//         `/friend-request/status?userId=${buddy._id}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (data.canChat) {
//         // Already friends, go to chat
//         const user = JSON.parse(localStorage.getItem("user"));
//         const roomId = [user.id, buddy._id].sort().join("-");
//         navigate(`/chat/${roomId}`, { state: { buddy } });
//       } else if (data.status === "pending") {
//         alert("Friend request already sent! Wait for them to accept.");
//       } else {
//         // Send friend request
//         await API.post(
//           "/friend-request/send",
//           { toUserId: buddy._id },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         // Add to sent requests
//         setSentRequests((prev) => new Set([...prev, buddy._id]));

//         alert("Friend request sent! 🎉");
//         // Trigger notification update
//         window.dispatchEvent(new Event("message-update"));
//       }
//     } catch (err) {
//       console.error("Select buddy error:", err);
//       alert(err.response?.data?.msg || "Failed to connect");
//     }
//   };

//   const isRequestSent = (userId) => {
//     return sentRequests.has(userId);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 text-white p-6">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-4xl font-black mb-2">
//           <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
//             Find Your Tea Buddy
//           </span>
//         </h1>
//         <p className="text-gray-400 mb-8">
//           People within 1KM radius • Real-time results
//         </p>

//         {/* Interest Selection with Edit */}
//         <div className="mb-4 bg-white bg-opacity-5 backdrop-blur-lg border border-white border-opacity-10 rounded-xl p-5">
//           <div className="flex items-center justify-between mb-3">
//             <label className="text-lg font-semibold flex items-center gap-2">
//               <span>💬</span> What vibes are we talking about?
//             </label>
//             {!isEditingInterest && interest && (
//               <button
//                 onClick={() => setIsEditingInterest(true)}
//                 className="text-xs px-3 py-1 bg-purple-500 rounded-lg hover:bg-purple-600 transition"
//               >
//                 Edit
//               </button>
//             )}
//           </div>

//           {isEditingInterest || !interest ? (
//             <div>
//               <select
//                 value={interest}
//                 onChange={(e) => setInterest(e.target.value)}
//                 className="w-full p-4 bg-black bg-opacity-50 border border-purple-500 border-opacity-30 rounded-xl focus:outline-none focus:border-purple-500 text-lg font-medium mb-2"
//               >
//                 <option value="">Pick your topic...</option>
//                 {interests.map((i) => (
//                   <option key={i} value={i}>
//                     {i}
//                   </option>
//                 ))}
//               </select>
//               <div className="flex gap-2 justify-end">
//                 {interest && (
//                   <button
//                     onClick={() => setIsEditingInterest(false)}
//                     className="text-xs px-3 py-1 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
//                   >
//                     Cancel
//                   </button>
//                 )}
//                 <button
//                   onClick={handleSaveInterest}
//                   className="text-xs px-4 py-1 bg-green-500 rounded-lg hover:bg-green-600 transition font-semibold"
//                   disabled={!interest}
//                 >
//                   Save
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div className="p-4 bg-purple-500 bg-opacity-10 rounded-lg border-l-2 border-purple-500">
//               <p className="text-xl font-semibold text-purple-300">
//                 {interest}
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Persistent Comment Box with Edit */}
//         <div className="mb-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl p-0.5">
//           <div className="bg-black rounded-xl p-5">
//             <div className="flex items-center justify-between mb-3">
//               <label className="text-sm font-semibold flex items-center gap-2">
//                 <span>✨</span> Addition to your Vibes
//               </label>
//               {!isEditingComment && comment && (
//                 <button
//                   onClick={() => setIsEditingComment(true)}
//                   className="text-xs px-3 py-1 bg-purple-500 rounded-lg hover:bg-purple-600 transition"
//                 >
//                   Edit
//                 </button>
//               )}
//             </div>

//             {isEditingComment || !comment ? (
//               <>
//                 <textarea
//                   value={comment}
//                   onChange={(e) => setComment(e.target.value)}
//                   maxLength={150}
//                   placeholder="e.g., 'Just binged Stranger Things S5!' or 'Thoughts on the new iPhone?'"
//                   rows="3"
//                   className="w-full p-4 bg-white bg-opacity-5 border border-purple-500 border-opacity-30 rounded-xl focus:outline-none focus:border-purple-500 resize-none placeholder-gray-500"
//                 />
//                 <div className="flex justify-between items-center mt-2">
//                   <p className="text-xs text-gray-400">
//                     {comment.length}/150 • Auto-deletes after 1 hour
//                   </p>
//                   <div className="flex gap-2">
//                     {comment && (
//                       <button
//                         onClick={() => {
//                           setIsEditingComment(false);
//                           // Restore original comment
//                         }}
//                         className="text-xs px-3 py-1 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
//                       >
//                         Cancel
//                       </button>
//                     )}
//                     <button
//                       onClick={handleSaveComment}
//                       className="text-xs px-4 py-1 bg-green-500 rounded-lg hover:bg-green-600 transition font-semibold"
//                     >
//                       Save
//                     </button>
//                   </div>
//                 </div>
//               </>
//             ) : (
//               <div className="p-4 bg-purple-500 bg-opacity-10 rounded-lg border-l-2 border-purple-500">
//                 <p className="text-gray-200 italic">"{comment}"</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Find Button */}
//         <button
//           onClick={handleFindBuddies}
//           disabled={finding || !interest}
//           className="w-full group relative px-8 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mb-8"
//         >
//           {finding ? (
//             <span className="flex items-center justify-center gap-3">
//               <span className="animate-spin">🔄</span> Scanning nearby...
//             </span>
//           ) : (
//             <span className="flex items-center justify-center gap-3">
//               🔍 Find Buddies Within 1KM
//             </span>
//           )}
//         </button>

//         {/* Results */}
//         {(matchedUsers.length > 0 || otherUsers.length > 0) && (
//           <div>
//             {/* Matched Interest Users */}
//             {matchedUsers.length > 0 && (
//               <div className="mb-8">
//                 <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
//                   <span className="text-3xl">🎯</span>
//                   <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
//                     Perfect Match ({matchedUsers.length})
//                   </span>
//                 </h2>
//                 <div className="space-y-3">
//                   {matchedUsers.map((user) => (
//                     <div
//                       key={user._id}
//                       className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-0.5 hover:scale-102 transition-transform"
//                     >
//                       <div className="bg-black rounded-2xl p-5">
//                         <div className="flex justify-between items-start gap-4">
//                           <div className="flex-1">
//                             <p className="font-bold text-2xl mb-1">
//                               {user.name}
//                             </p>
//                             <p className="text-sm text-gray-400 mb-1">
//                               <span className="text-purple-300">
//                                 {user.profession}
//                               </span>
//                             </p>
//                             <p className="text-sm font-semibold text-green-400 flex items-center gap-1">
//                               <span>💬</span> {user.interest}
//                             </p>
//                             {user.availabilityComment && (
//                               <div className="mt-3 p-3 bg-green-500 bg-opacity-10 rounded-lg border-l-2 border-green-500">
//                                 <p className="text-sm text-gray-200 italic">
//                                   "{user.availabilityComment}"
//                                 </p>
//                               </div>
//                             )}
//                           </div>
//                           <button
//                             onClick={() => handleSelectBuddy(user)}
//                             disabled={isRequestSent(user._id)}
//                             className={`px-6 py-3 font-bold rounded-xl hover:shadow-lg transition whitespace-nowrap ${
//                               isRequestSent(user._id)
//                                 ? "bg-gray-600 text-gray-300 cursor-not-allowed"
//                                 : "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-green-500/50"
//                             }`}
//                           >
//                             {isRequestSent(user._id)
//                               ? "Request Sent ✓"
//                               : "Send Request ✉️"}
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Other Interest Users */}
//             {otherUsers.length > 0 && (
//               <div>
//                 <h2 className="text-xl font-semibold mb-4 text-gray-400">
//                   Other Interests ({otherUsers.length})
//                 </h2>
//                 <div className="space-y-3">
//                   {otherUsers.map((user) => (
//                     <div
//                       key={user._id}
//                       className="bg-gray-900 p-4 rounded-lg border border-gray-700 hover:bg-gray-800 transition"
//                     >
//                       <div className="flex justify-between items-start mb-2">
//                         <div className="flex-1">
//                           <p className="font-semibold text-lg">{user.name}</p>
//                           <p className="text-sm text-gray-400">
//                             {user.profession}
//                           </p>
//                           <p className="text-sm text-blue-400">
//                             💬 {user.interest}
//                           </p>
//                           {user.availabilityComment && (
//                             <div className="mt-2 p-2 bg-gray-800 rounded border-l-2 border-blue-500">
//                               <p className="text-sm text-gray-300 italic">
//                                 "{user.availabilityComment}"
//                               </p>
//                             </div>
//                           )}
//                         </div>
//                         <button
//                           onClick={() => handleSelectBuddy(user)}
//                           className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition whitespace-nowrap ml-4"
//                         >
//                           Chat ✓
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {/* No Results */}
//         {!finding &&
//           matchedUsers.length === 0 &&
//           otherUsers.length === 0 &&
//           location && (
//             <div className="text-center py-12">
//               <p className="text-gray-400 text-lg">
//                 No buddies available nearby right now.
//               </p>
//               <p className="text-gray-500 text-sm mt-2">
//                 Try changing your interest or check back later!
//               </p>
//             </div>
//           )}
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function FindBuddy() {
  const [interest, setInterest] = useState("");
  const [isEditingInterest, setIsEditingInterest] = useState(false);

  // PRIMARY STATES for Comment (saved/displayed value)
  const [comment, setComment] = useState("");
  // TEMPORARY STATE for Comment (value while user is typing/editing)
  const [tempComment, setTempComment] = useState("");
  const [isEditingComment, setIsEditingComment] = useState(false);

  const [location, setLocation] = useState(null);
  const [finding, setFinding] = useState(false);
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [otherUsers, setOtherUsers] = useState([]);
  const [sentRequests, setSentRequests] = useState(new Set());
  const navigate = useNavigate();

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
    const fetchUserData = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.interest) {
        setInterest(user.interest);
      }

      // Fetch latest comment from backend
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const { data } = await API.get("/profile/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (data.user.availabilityComment) {
            const savedComment = data.user.availabilityComment;
            setComment(savedComment); // Set primary comment state
            setTempComment(savedComment); // Initialize temporary comment state
          }
        } catch (err) {
          console.error("Failed to fetch user data:", err);
        }
      }
    };

    fetchUserData();
  }, []);

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  const handleSaveComment = async () => {
    const token = localStorage.getItem("token");
    try {
      // Use tempComment for the API call
      await API.put(
        "/profile/update-comment",
        { availabilityComment: tempComment }, // <-- Using tempComment
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the permanent comment state only after successful API save
      setComment(tempComment); // <-- Update primary state
      setIsEditingComment(false);
      //alert("Comment saved! It will be visible for 1 hour.");
    } catch (err) {
      console.error("Save comment error:", err);
      alert("Failed to save comment");
    }
  };

  const handleSaveInterest = async () => {
    if (!interest) {
      alert("Please select an interest");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const { data } = await API.post(
        "/profile/save",
        { interest },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update localStorage
      const user = JSON.parse(localStorage.getItem("user"));
      user.interest = interest;
      localStorage.setItem("user", JSON.stringify(user));

      setIsEditingInterest(false);
      //alert("Interest updated!");
    } catch (err) {
      console.error("Save interest error:", err);
      alert("Failed to save interest");
    }
  };

  const handleFindBuddies = async () => {
    if (!interest) {
      alert("Please select an interest");
      return;
    }

    setFinding(true);
    try {
      // Get current location
      const loc = await getLocation();
      setLocation(loc);

      const token = localStorage.getItem("token");

      // Update location (don't send comment here, it's already saved)
      await API.put(
        "/profile/update-location",
        {
          longitude: loc.longitude,
          latitude: loc.latitude,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Find nearby buddies with selected interest
      const { data } = await API.get("/buddy/find-nearby", {
        params: {
          longitude: loc.longitude,
          latitude: loc.latitude,
          interest: interest, // Send selected interest
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      setMatchedUsers(data.matchedInterest || []);
      setOtherUsers(data.otherInterests || []);

      if (data.totalFound === 0) {
        alert("No buddies found nearby. Try again later!");
      }
    } catch (err) {
      console.error("Find buddies error:", err);
      if (err.message?.includes("denied")) {
        alert("Location permission denied. Please enable location access.");
      } else {
        alert(err.response?.data?.msg || "Failed to find buddies");
      }
    } finally {
      setFinding(false);
    }
  };

  const handleSelectBuddy = async (buddy) => {
    const token = localStorage.getItem("token");

    try {
      // Check friend status first
      const { data } = await API.get(
        `/friend-request/status?userId=${buddy._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.canChat) {
        // Already friends, go to chat
        const user = JSON.parse(localStorage.getItem("user"));
        const roomId = [user.id, buddy._id].sort().join("-");
        navigate(`/chat/${roomId}`, { state: { buddy } });
      } else if (data.status === "pending") {
        alert("Friend request already sent! Wait for them to accept.");
      } else {
        // Send friend request
        await API.post(
          "/friend-request/send",
          { toUserId: buddy._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Add to sent requests
        setSentRequests((prev) => new Set([...prev, buddy._id]));

        alert("Friend request sent! 🎉");
        // Trigger notification update
        window.dispatchEvent(new Event("message-update"));
      }
    } catch (err) {
      console.error("Select buddy error:", err);
      alert(err.response?.data?.msg || "Failed to connect");
    }
  };

  const isRequestSent = (userId) => {
    return sentRequests.has(userId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-2">
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Find Your Tea Buddy
          </span>
        </h1>
        <p className="text-gray-400 mb-8">People in your zone(1KM)</p>

        {/* Interest Selection with Edit */}
        <div className="mb-4 bg-white bg-opacity-5 backdrop-blur-lg border border-white border-opacity-10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <label className="text-lg font-semibold flex items-center gap-2">
              <span>💬</span> What mood are we talking about?
            </label>
            {!isEditingInterest && interest && (
              <button
                onClick={() => setIsEditingInterest(true)}
                className="text-xs px-3 py-1 bg-purple-500 rounded-lg hover:bg-purple-600 transition"
              >
                Edit
              </button>
            )}
          </div>

          {isEditingInterest || !interest ? (
            <div>
              <select
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                className="w-full p-4 bg-black bg-opacity-50 border border-purple-500 border-opacity-30 rounded-xl focus:outline-none focus:border-purple-500 text-lg font-medium mb-2"
              >
                <option value="">Pick your topic...</option>
                {interests.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
              <div className="flex gap-2 justify-end">
                {interest && (
                  <button
                    onClick={() => setIsEditingInterest(false)}
                    className="text-xs px-3 py-1 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={handleSaveInterest}
                  className="text-xs px-4 py-1 bg-green-500 rounded-lg hover:bg-green-600 transition font-semibold"
                  disabled={!interest}
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-purple-500 bg-opacity-10 rounded-lg border-l-2 border-purple-500">
              <p className="text-xl font-semibold text-purple-300">
                {interest}
              </p>
            </div>
          )}
        </div>

        {/* Persistent Comment Box with Edit */}
        <div className="mb-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl p-0.5">
          <div className="bg-black rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold flex items-center gap-2">
                <span>✨</span> Addition to your Vibes
              </label>
              {!isEditingComment && comment && (
                <button
                  onClick={() => {
                    setTempComment(comment); // Initialize tempComment with the current saved comment
                    setIsEditingComment(true);
                  }}
                  className="text-xs px-3 py-1 bg-purple-500 rounded-lg hover:bg-purple-600 transition"
                >
                  Edit
                </button>
              )}
            </div>

            {/* Conditional Rendering based on editing state */}
            {isEditingComment || !comment ? (
              <>
                <textarea
                  value={tempComment} // BIND TO TEMPORARY STATE
                  onChange={(e) => setTempComment(e.target.value)} // UPDATE TEMPORARY STATE
                  maxLength={150}
                  placeholder="e.g., 'Just binged Stranger Things S5!' or 'Thoughts on the new iPhone?'"
                  rows="3"
                  className="w-full p-4 bg-white bg-opacity-5 border border-purple-500 border-opacity-30 rounded-xl focus:outline-none focus:border-purple-500 resize-none placeholder-gray-500"
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-400">
                    {tempComment.length}/150 • Auto-deletes after 1 hour{" "}
                    {/* USE TEMP COMMENT LENGTH */}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setTempComment(comment); // Restore temp state to last saved comment
                        setIsEditingComment(false);
                      }}
                      className="text-xs px-3 py-1 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveComment}
                      className="text-xs px-4 py-1 bg-green-500 rounded-lg hover:bg-green-600 transition font-semibold"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-4 bg-purple-500 bg-opacity-10 rounded-lg border-l-2 border-purple-500">
                <p className="text-gray-200 italic">"{comment}"</p>{" "}
                {/* DISPLAY PRIMARY STATE */}
              </div>
            )}
          </div>
        </div>

        {/* Find Button */}
        <button
          onClick={handleFindBuddies}
          disabled={finding || !interest}
          className="w-full group relative px-8 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mb-8"
        >
          {finding ? (
            <span className="flex items-center justify-center gap-3">
              <span className="animate-spin">🔄</span> Scanning nearby...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-3">
              🔍 Find Buddies Within 1KM
            </span>
          )}
        </button>

        {/* Results */}
        {(matchedUsers.length > 0 || otherUsers.length > 0) && (
          <div>
            {/* Matched Interest Users */}
            {matchedUsers.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-3xl">🎯</span>
                  <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    Perfect Match ({matchedUsers.length})
                  </span>
                </h2>
                <div className="space-y-3">
                  {matchedUsers.map((user) => (
                    <div
                      key={user._id}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-0.5 hover:scale-102 transition-transform"
                    >
                      <div className="bg-black rounded-2xl p-5">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <p className="font-bold text-2xl mb-1">
                              {user.name}
                            </p>
                            <p className="text-sm text-gray-400 mb-1">
                              <span className="text-purple-300">
                                {user.profession}
                              </span>
                            </p>
                            <p className="text-sm font-semibold text-green-400 flex items-center gap-1">
                              <span>💬</span> {user.interest}
                            </p>
                            {user.availabilityComment && (
                              <div className="mt-3 p-3 bg-green-500 bg-opacity-10 rounded-lg border-l-2 border-green-500">
                                <p className="text-sm text-gray-200 italic">
                                  "{user.availabilityComment}"
                                </p>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleSelectBuddy(user)}
                            disabled={isRequestSent(user._id)}
                            className={`px-6 py-3 font-bold rounded-xl hover:shadow-lg transition whitespace-nowrap ${
                              isRequestSent(user._id)
                                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                                : "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-green-500/50"
                            }`}
                          >
                            {isRequestSent(user._id)
                              ? "Request Sent ✓"
                              : "Send Request ✉️"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Other Interest Users */}
            {otherUsers.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-400">
                  Other Interests ({otherUsers.length})
                </h2>
                <div className="space-y-3">
                  {otherUsers.map((user) => (
                    <div
                      key={user._id}
                      className="bg-gray-900 p-4 rounded-lg border border-gray-700 hover:bg-gray-800 transition"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="font-semibold text-lg">{user.name}</p>
                          <p className="text-sm text-gray-400">
                            {user.profession}
                          </p>
                          <p className="text-sm text-blue-400">
                            💬 {user.interest}
                          </p>
                          {user.availabilityComment && (
                            <div className="mt-2 p-2 bg-gray-800 rounded border-l-2 border-blue-500">
                              <p className="text-sm text-gray-300 italic">
                                "{user.availabilityComment}"
                              </p>
                            </div>
                          )}
                        </div>
                        {/* Note: In the original code, the button for 'Other Interests' defaulted to 'Chat ✓', 
                            but the logic in handleSelectBuddy still checks friend status and sends a request if necessary.
                            I kept the button text as is for consistency with your provided code, but be aware of this potential UX inconsistency. */}
                        <button
                          onClick={() => handleSelectBuddy(user)}
                          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition whitespace-nowrap ml-4"
                        >
                          Chat ✓
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* No Results */}
        {!finding &&
          matchedUsers.length === 0 &&
          otherUsers.length === 0 &&
          location && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                No buddies available nearby right now.
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Try changing your interest or check back later!
              </p>
            </div>
          )}
      </div>
    </div>
  );
}
