import "./styles/globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <div className="pageWrapper">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
