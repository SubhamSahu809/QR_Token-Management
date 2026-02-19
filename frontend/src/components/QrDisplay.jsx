function QrDisplay({ qrCodeDataUrl }) {
  if (!qrCodeDataUrl) {
    return null;
  }

  return (
    <div className="qr-container">
      <img src={qrCodeDataUrl} alt="QR Code" />
      <p>Scan the QR code.</p>
    </div>
  );
}

export default QrDisplay;

