import { useState } from "react";
import axios from "axios";
import QrDisplay from "./QrDisplay";

function TokenForm() {
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [tokenCount, setTokenCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setResult(null);

    if (!name || !mobileNumber || !tokenCount) {
      setError("Please fill all fields.");
      return;
    }

    const maxCount = Number(tokenCount);
    if (Number.isNaN(maxCount) || maxCount <= 0) {
      setError("Token count must be a positive number.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("https://or-token-management.onrender.com/tokens/generate", {
        name,
        mobileNumber,
        maxCount,
      });

      setResult(response.data);
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message || "Failed to generate token. Try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
          />
        </label>

        <label>
          Mobile Number
          <input
            type="text"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            placeholder="Enter mobile number"
          />
        </label>

        <label>
          Token Count (max scans)
          <input
            type="number"
            value={tokenCount}
            onChange={(e) => setTokenCount(e.target.value)}
            min="1"
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Token"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result">
          <h3>Token Created</h3>
          <p>Token ID: {result.token.tokenId}</p>
          <p>Max Count: {result.token.maxCount}</p>
          <p>Remaining: {result.token.remainingCount}</p>
          <p>Scan URL: {result.scanUrl}</p>
          <QrDisplay qrCodeDataUrl={result.qrCodeDataUrl} />
        </div>
      )}
    </div>
  );
}

export default TokenForm;

