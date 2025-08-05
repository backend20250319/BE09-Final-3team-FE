import "./styles/globals.css";

export default function RootLayout({ children }) {
  return (
    <div className="pageWrapper">
      <html lang="en">
        <body>{children}</body>
      </html>
    </div>
  );
}
