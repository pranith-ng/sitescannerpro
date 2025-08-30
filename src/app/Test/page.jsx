'use client'



export default function Loading() {
    return (
        <div
            style={{
                backgroundColor: "#E0DAD0",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
            }}
        >
            <div className="bar"></div>
            <div className="bar" style={{ animationDelay: "0.2s" }}></div>
            <div className="bar" style={{ animationDelay: "0.4s" }}></div>

            <style jsx>{`
        .bar {
          width: 20px;
          height: 40px;
          // background-color: #000;
          background-color:#1b4c9c;
          box-shadow: 5px 5px 6px #c1bbb3, -4px -4px 6px #fff9ed;
          border-radius: 5px;
          animation: wave 0.6s infinite ease-in-out;
          position: relative;
        }

        @keyframes wave {
          0% { top: 0px; }
          50% { top: -20px; }
          100% { top: 0px; }
        }
      `}</style>
        </div>
    );
}
