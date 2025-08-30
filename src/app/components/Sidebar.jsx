import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppContext } from "../Context/AppContext";
import AuthHandler from "../components/AuthHandler";


const Sidebar = ({ historyItems }) => {

  const {user, setUser} = useContext(AppContext)

  const [email, setemail] = useState("")

  const router = useRouter()

    const handleSignOut = async () => {

         const result = await AuthHandler({ action: "signout" })
         if (result.error) {
             // setMessage(result.error)
             console.log(result.error)
         }
         if (result) {
             console.log(result)
         }
     }


  return (
    <aside
      className="w-64 h-screen pt-20 bg-[#E0DAD0] text-black flex flex-col p-4"
      style={{
        boxShadow: "4px 0 8px -2px rgba(0, 0, 0, 0.2)", // shadow on right side only
      }}
    >
      {/* Top section: History */}
      <div className="flex-grow overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6">History</h2>
        <ul className="flex flex-col space-y-3">
          {historyItems && historyItems.length > 0 ? (
            historyItems.map((item, index) => (
              <li
                key={index}
                className="px-3 py-2 rounded hover:bg-gray-700 cursor-pointer truncate"
                title={item}
              >
                {item}
              </li>
            ))
          ) : (
            <li className="text-gray-400 italic">No history available</li>
          )}
        </ul>
      </div>

      {/* Bottom section: Account Details & Sign Out */}
      <div className="mt-6 border-t border-gray-700 pt-4">
        <div className="mb-3">
          <p className="text-sm text-gray-300">Signed in as</p>
          <p className="font-semibold truncate">{user?.email || "email"}</p>
        </div>
        <button
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-semibold transition"
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
