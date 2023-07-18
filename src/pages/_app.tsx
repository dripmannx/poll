import { ClerkProvider } from "@clerk/nextjs";
import { type AppType } from "next/app";
import { ThemeProvider } from "~/components/ui/theme-provider";
import "~/styles/globals.css";
import { api } from "~/utils/api";
const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Component {...pageProps} />
      </ThemeProvider>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
