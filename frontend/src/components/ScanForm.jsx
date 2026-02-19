import { useState } from "react";
import axios from "axios";

function ScanForm({ tokenId }) {
  const [scanCount, setScanCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [tokenInfo, setTokenInfo] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    const count = Number(scanCount);
    if (Number.isNaN(count) || count <= 0) {
      setError("Scan count must be a positive number.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:5000/tokens/scan/${tokenId}`,
        {
        scanCount: count,
        }
      );
      setMessage(response.data.message);
      setTokenInfo(response.data.token);
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message || "Failed to scan token. Try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Scan Count
          <input
            type="number"
            value={scanCount}
            min="1"
            onChange={(e) => setScanCount(e.target.value)}
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Scanning..." : "Submit Scan"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      {tokenInfo && (
        <div className="result">
          <h3>Token Status</h3>
          <p>Name: {tokenInfo.name}</p>
          <p>Mobile: {tokenInfo.mobileNumber}</p>
          <p>Remaining Count: {tokenInfo.remainingCount}</p>
          <p>Status: {tokenInfo.status}</p>
        </div>
      )}
    </div>
  );
}

export default ScanForm;

