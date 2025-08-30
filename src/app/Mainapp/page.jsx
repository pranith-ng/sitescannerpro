"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useContext } from "react";
import { AppContext } from "../Context/AppContext";
import MainNavbar from "../components/Mainnavbar";
import Bar from "../components/Bar";
import Metrics from "../components/Metrics";
import Screenshot from "../components/Screenshot";
import AIStr from "../components/Aistr";
import { extractLighthouseSummary } from "@/lib/Userdatacreator"
import { useRouter } from "next/navigation";

export default function ScanForm() {

  const router = useRouter()

  const { user } = useContext(AppContext)


  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");


  const lcpNode =
    result?.lighthouseResult?.audits?.["largest-contentful-paint-element"]
      ?.details?.items?.[0]?.items?.[0]?.node || {};

  const snippet = lcpNode.snippet || "";
  const nodeLabel = lcpNode.nodeLabel || "";

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
      console.log(data)
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const checkings = extractLighthouseSummary(result)
  console.log(checkings)

  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  }, [user])

  if (!user) {
    return null
  }

  if (user) {
    return (
      <div className="min-h-screen bg-[#E0DAD0]">
        <MainNavbar />
        <div className="max-w-[1200px] mx-auto p-4 ">
          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6 md:max-w-2/3 m-auto">
            <input
              type="text"
              placeholder="Enter website URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-4xl focus:outline-none neumorphic-pressed-input text-engraved"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 text-black rounded-4xl ml-8"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-7 h-7 border-black border-4 border-t-transparent rounded-full"
                />
              ) : (
                "Scan"
              )}
            </button>

          </form>

          {error && <p className="text-red-600 mt-2">{error}</p>}


          {result &&

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}        // before visible
              whileInView={{ opacity: 1, scale: 1 }}     // when in viewport
              transition={{ duration: 1.4, ease: "backOut" }}
            >
              <div className="mt-3 m-auto md:max-w-3/5">
                <h2 className="py-6 text-xl font-semibold text-center">Website Performance Scores:</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2" >
                  {Object.entries(result.lighthouseResult.categories).map(([key, item], index) => {
                    return (
                      <Bar
                        key={index} percentage={Math.round(item.score * 100)} name={item.title} />
                    )
                  })}
                </div>

              </div>




              <div className="md:mt-6">
                <h2 className="text-xl text-center py-6 font-semibold  ">Metrics:</h2>
                <Metrics data={result} />
              </div>

              <div className="p-4 rounded mt-6 neumorphic md:max-w-3/4 m-auto">
                <h3 className="font-semibold">LCP Element:</h3>

                {snippet ? (
                  <div className="w-fit">
                    <div className="p-2 rounded neumorphic">
                      {snippet}
                    </div>
                  </div>
                ) : (
                  <p>No LCP snippet found.</p>
                )}

                {nodeLabel && (
                  <p className="mt-2 text-gray-600">Content: {nodeLabel}</p>
                )}
              </div>


              <div className="mt-6">
                < Screenshot data={result} />
              </div>


              <div>
                < AIStr data={result} />
              </div>
            </motion.div>

          }
        </div>
      </div>
    );
  }

}
