import { useState } from "react";
import axios from "axios";
import QrDisplay from "../components/QrDisplay";

function ViewQrPage() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!mobileNumber) {
      setError("Please enter mobile number.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get("https://or-token-management.onrender.com/tokens/viewQr", {
        params: { mobileNumber },
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        "Could not fetch QR for this mobile number.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2>View QR by Mobile Number</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Mobile Number
          <input
            type="text"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            placeholder="Enter mobile number"
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Get QR"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result">
          <h3>Token Info</h3>
          <p>Name: {result.token.name}</p>
          <p>Mobile: {result.token.mobileNumber}</p>
          <p>Token ID: {result.token.tokenId}</p>
          <p>Remaining: {result.token.remainingCount}</p>
          <p>Status: {result.token.status}</p>
          <p>Scan URL: {result.scanUrl}</p>
          <QrDisplay qrCodeDataUrl={result.qrCodeDataUrl} />
        </div>
      )}
    </div>
  );
}

export default ViewQrPage;

