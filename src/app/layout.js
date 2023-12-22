import "./globals.css";
import { Inter } from "next/font/google";

import { LanguageProvider } from "contexts/LanguageContext";
import { NavbarProvider } from "contexts/NavbarContext";
import { UserProvider } from "@/contexts/UserContext";
import { ModalsProvider } from "@/contexts/ModalsContext";
import { QuizMakerProvider } from "@/contexts/QuizMakerContext";
import { QuizzesProvider } from "@/contexts/QuizzesContext";

import MainContainer from "components/MainContainer";
import LoadingModal from "@/components/modals/LoadingModal";
import ConfirmModal from "@/components/modals/ConfirmModal";
import PersonalityModal from "@/components/modals/PersonalityModal";
import AssignPersonalityModal from "@/components/modals/AssignPersonalityModal";
import HanldeImageModal from "@/components/modals/HandleImageModal";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Random Quiz",
  description: "Created by Scu",
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body className={[inter.className]}>
        <LanguageProvider>
          <NavbarProvider>
            <ModalsProvider>
              <UserProvider>
                <QuizMakerProvider>
                  <QuizzesProvider>
                    <LoadingModal />
                    <ConfirmModal />
                    <PersonalityModal />
                    <AssignPersonalityModal />
                    <HanldeImageModal />
                    <MainContainer>{children}</MainContainer>
                  </QuizzesProvider>
                </QuizMakerProvider>
              </UserProvider>
            </ModalsProvider>
          </NavbarProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
