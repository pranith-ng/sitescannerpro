'use client'

import { useState } from "react";

export default function ScanForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return setError("Please enter a URL");

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/scan?url=${encodeURIComponent(url)}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Scan failed");

      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter website URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ width: "80%", padding: 8 }}
        />
        <button type="submit" disabled={loading} style={{ padding: 8, marginLeft: 8 }}>
          {loading ? "Scanning..." : "Scan"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <pre
          style={{
            background: "#f4f4f4",
            padding: 10,
            marginTop: 20,
            maxHeight: 400,
            overflow: "auto",
          }}
        >
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}





// 'use client'

// import { useState } from "react";

// export default function ScanForm() {
//   const [url, setUrl] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!url) return setError("Please enter a URL");

//     setLoading(true);
//     setError("");
//     setResult(null);

//     try {
//       const res = await fetch(`/api/scan?url=${encodeURIComponent(url)}`);
//       const data = await res.json();

//       if (!res.ok) throw new Error(data.error || "Scan failed");

//       setResult(data);
//     } catch (err) {
//       setError(err.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-[#E0DAD0] px-4">
//       <div className="w-full max-w-md p-8 rounded-2xl neumorphic">
//         <h1 className="text-3xl font-bold text-center mb-6">Website Scanner</h1>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="text"
//             placeholder="Enter website URL"
//             value={url}
//             onChange={(e) => setUrl(e.target.value)}
//             className="w-full pl-4 pr-4 py-3 rounded-4xl focus:outline-none neumorphic-pressed-input text-engraved"
//           />

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full py-3 rounded-4xl font-semibold neumorphic hover:neumorphic-pressed transition"
//           >
//             {loading ? "Scanning..." : "Scan"}
//           </button>
//         </form>

//         {error && <p className="text-red-500 text-center mt-3">{error}</p>}

//         {result && (
//           <div
//             className="mt-6 p-4 rounded-2xl bg-[#F4F4F4] overflow-auto max-h-96"
//             style={{ fontFamily: "monospace" }}
//           >
//             {renderJSON(result)}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // Helper function to render JSON nicely
// function renderJSON(obj) {
//   if (typeof obj !== "object" || obj === null) return <span>{String(obj)}</span>;

//   return (
//     <ul className="pl-4 list-disc">
//       {Object.entries(obj).map(([key, value]) => (
//         <li key={key}>
//           <strong>{key}: </strong>
//           {typeof value === "object" && value !== null ? renderJSON(value) : String(value)}
//         </li>
//       ))}
//     </ul>
//   );
// }
