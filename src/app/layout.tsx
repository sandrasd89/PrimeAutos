import Navbar from "@/components/Navbar";
import LanguageSwitcher from "@/components/LanguageSwitcher"; // Componente para cambiar idioma
import { Roboto } from "next/font/google";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/contexts/LanguageContext";
import './globals.css';
import ChatbotWidget from "@/components/ChatBoxWidget";
import '../utils/i18n';
//import '../styles/tailwind.css';


export const metadata = {
  title: "Taller Prime Autos",
  description: "Página principal de Taller de Coches - Prime Autos"
};

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  style: ["italic", "normal"],
  subsets: ["latin"],
});

export default function RootLayout({  
  children,
}: {
  children: React.ReactNode;
}) {
  return( 
    <LanguageProvider>
      <html lang="es">
        <head>
          <title>Taller Prime Autos</title>
        </head>
        <body className={roboto.className}>
          <Navbar />
          <LanguageSwitcher />
          {children}
          <ChatbotWidget />
          <Footer />
        </body>
      </html>
    </LanguageProvider>
  );
};
