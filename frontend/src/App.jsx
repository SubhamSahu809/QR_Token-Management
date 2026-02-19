import { Routes, Route, Link } from "react-router-dom";
import GenerateTokenPage from "./pages/GenerateTokenPage";
import ScanTokenPage from "./pages/ScanTokenPage";
import ViewQrPage from "./pages/ViewQrPage";

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>QR Token Management App</h1>
        <nav>
          <Link to="/">Generate Token</Link>
          <Link to="/view-qr">View QR</Link>
        </nav>
      </header>

      <main className="main">
        <Routes>
          <Route path="/" element={<GenerateTokenPage />} />
          <Route path="/scan/:tokenId" element={<ScanTokenPage />} />
          <Route path="/view-qr" element={<ViewQrPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

