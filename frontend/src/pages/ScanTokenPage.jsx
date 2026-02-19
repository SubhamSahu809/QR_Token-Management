import { useParams } from "react-router-dom";
import ScanForm from "../components/ScanForm";

function ScanTokenPage() {
  const { tokenId } = useParams();

  return (
    <div className="card">
      <h2>Scan Token</h2>
      <p>Token ID: {tokenId}</p>
      <ScanForm tokenId={tokenId} />
    </div>
  );
}

export default ScanTokenPage;

