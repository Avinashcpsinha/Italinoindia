import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ItalioIndia",
  description: "Slow, hand-crafted journeys across India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
