import React from "react";

const Screenshot = ({ data }) => {
    if (!data?.lighthouseResult) return null;

    const screenshotData =
        data.lighthouseResult.audits["final-screenshot"]?.details?.data;

    if (!screenshotData) return null;

    return (
        <div>
            <h2 className="py-4 text-xl text-center md:py-6 font-semibold">
                Page Screenshot:
            </h2>

            <div className="relative w-full max-w-3xl h-70 mx-auto overflow-hidden md:h-96">
                <img
                    src={screenshotData}
                    alt="Page Screenshot"
                    className="w-full h-full object-contain rounded"
                />
            </div>
        </div>
    );
};

export default Screenshot;