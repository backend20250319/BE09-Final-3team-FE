export const metadata = {
  title: "Petful",
  description: "A pet influencer platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
