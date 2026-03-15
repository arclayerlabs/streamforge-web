import "./globals.css";

export const metadata = {
  title: "StreamForge",
  description: "Open source contribution streaming protocol",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
