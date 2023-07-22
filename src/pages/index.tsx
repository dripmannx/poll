import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Metadata } from "next";
import Head from "next/head";
import Link from "next/link";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Button } from "~/components/ui/button";
import { MainNav } from "~/components/ui/main-nav";
import { UserNav } from "~/components/ui/user-nav";

export const metadata: Metadata = {
  title: "Poll App",
  description: "Erstellen und Teilen Sie Umfragen kinderleicht",
};

const LandingPage = () => {
  return (
    <>
      <meta property="og:title" content="Umfrage App" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="http://dripmann.de" />

      <meta
        property="og:description"
        content="Erstellen und Teilen Sie Umfragen kinderleicht"
      />

      <Head>
        <title>Erstellen und Teilen Sie Umfragen</title>
      </Head>

      <main className="">
        <section className="">
          {/* Illustration behind hero content */}

          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            {/* Hero content */}
            <div className="pb-12 pt-32 md:pb-20 md:pt-40">
              {/* Section header */}
              <div className="pb-12 text-center md:pb-16">
                <h1
                  className="leading-tighter mb-4 text-5xl font-extrabold tracking-tighter md:text-6xl"
                  data-aos="zoom-y-out"
                >
                  Erstelle eine neue Umfrage{" "}
                  <span className="bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
                    in Sekunden
                  </span>
                </h1>
                <div className="mx-auto max-w-3xl">
                  <p
                    className="mb-8 text-xl text-gray-600"
                    data-aos="zoom-y-out"
                    data-aos-delay="150"
                  >
                    Erstelle jetzt innerhalb Sekunden eine Umfrage und teile Sie
                    mit deinen Freunden oder Veröffentliche sie, damit Menschen
                    auf der ganzen Welt abstimmen können
                  </p>
                  <div
                    className="mx-auto flex max-w-xs gap-4 sm:flex sm:max-w-none sm:justify-center"
                    data-aos="zoom-y-out"
                    data-aos-delay="300"
                  >
                    <div>
                      <Button size={"lg"}>
                        {" "}
                        <Link href={"/new"} className="flex   gap-2">
                          Umfage erstellen{" "}
                        </Link>
                      </Button>
                    </div>
                    <div>
                      <Button variant={"secondary"} size={"lg"}>
                        Demo testen
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hero image */}
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default LandingPage;
