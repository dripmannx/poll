import { ClerkProvider } from "@clerk/nextjs";
import { type AppType } from "next/app";
import { MainNav } from "~/components/ui/main-nav";
import { ThemeProvider } from "~/components/ui/theme-provider";
import { UserNav } from "~/components/ui/user-nav";
import "~/styles/globals.css";
import { api } from "~/utils/api";
import Layout from "../components/Layout/Layout";
const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
