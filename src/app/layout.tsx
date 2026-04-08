import type { Metadata } from "next";
import { Inter, Manrope, Playfair_Display, Cinzel } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const manrope = Manrope({ subsets: ["latin"], weight: ["300", "400", "500"], variable: '--font-manrope' });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600"], style: ["normal", "italic"], variable: '--font-playfair' });
const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "500", "700"], variable: '--font-cinzel' });

export const metadata: Metadata = {
  title: "RUA | Aesthetic Decor",
  description: "Curating spaces that inspire, calm, and endure.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
      </head>
      <body className={`${manrope.variable} ${playfair.variable} ${cinzel.variable} antialiased font-sans bg-rua-beige text-rua-charcoal`}>
        {children}
      </body>
    </html>
  );
}
