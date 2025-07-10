import { useState } from "react";

function getTitleByCount(count) {
  if (count > 2000) return "You are a true Goblin 🦾";
  if (count > 1500) return "Verified Degen 🧃";
  if (count > 1000) return "Blockchain Voyager 🚀";
  if (count > 500) return "Rising Star ✨";
  return "Fresh Wallet. Touch Grass First 🌱";
}

export default function Home() {
  const [wallet, setWallet] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkTx = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/check?wallet=${encodeURIComponent(wallet.trim())}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Unknown error");
      setResult({
        count: json.totalTxCount,
        title: getTitleByCount(json.totalTxCount),
      });
    } catch (e) {
      setError(e.message);
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        backgroundColor: "black",
       
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "contain",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Supermolot, sans-serif",
        textAlign: "center",
        padding: "2rem",
        
        position: "relative",
        

      }}
    >
      <h2 style={{ marginBottom: 100, fontFamily: "Supermolot Bold", fontSize: 100 }}>
        Union Build TX Checker
      </h2>

      <input
        type="text"
        placeholder="Enter EVM wallet address"
        value={wallet}
        onChange={(e) => setWallet(e.target.value)}
        style={{
          width: "100%",
          maxWidth: 400,
          padding: 20,
          
          marginBottom: 35,
          fontSize: 25,
          borderRadius: 5,
          border: "1px solid #444",
          backgroundColor: "#1a1a1a",
          color: "white",
          fontFamily: "Supermolot Bold",
        }}
      />

      <button
        onClick={checkTx}
        disabled={loading || !wallet.trim()}
        style={{
          padding: "10px 20px",
          fontSize: 25,
          cursor: loading || !wallet.trim() ? "not-allowed" : "pointer",
          backgroundColor: "#4F46E5",
          color: "white",
          border: "none",
          borderRadius: 5,
          marginBottom: 20,
          fontFamily: "Supermolot Bold",
        }}
      >
        {loading ? "Checking..." : "Check TX Count"}
      </button>

      {error && <p style={{ color: "red", marginTop: 10 }}>Error: {error}</p>}

      {result && !error && (
        <div
          style={{
            backgroundColor: "#1f1f1f",
            padding: "20px",
            borderRadius: 10,
            textAlign: "center",
            maxWidth: 400,
            width: "100%",
            animation: "zoomIn 1s ease-out",
            boxShadow: "0 0 20px rgba(255,255,255,0.1)",
            fontFamily: "Supermolot Bold",
          }}
        >
          <p style={{ fontSize: 18, marginBottom: 10 }}>
            Total Transactions: <strong>{result.count}</strong>
          </p>
          <p style={{ fontSize: 25, fontWeight: "bold", color: "#4F46E5" }}>
            {result.title}
          </p>
        </div>
      )}

      <style>{`
        @keyframes zoomIn {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

      @font-face {
  font-family: 'Supermolot Bold';
  src: url('https://raw.githubusercontent.com/0xNexar/union-checker-app/main/Supermolot-Bold.ttf') format('truetype');
  font-weight: bold;
  font-style: normal;
}

      `}</style>
    </div>
  );
}
