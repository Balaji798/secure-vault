import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Secure Vault",
  description: "Secure password manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`font-synonym h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
