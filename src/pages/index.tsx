import { ArrowRightIcon } from "@radix-ui/react-icons";
import Head from "next/head";
import Link from "next/link";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Button } from "~/components/ui/button";
import { MainNav } from "~/components/ui/main-nav";
import { UserNav } from "~/components/ui/user-nav";
const LandingPage = () => {
  return (
    <div>
      <Head>
        <title>Strawpoll | Erstellen und Teilen Sie Umfragen</title>
      </Head>

      <main className="">
        <section className="">
          {/* Illustration behind hero content */}
          <div
            className="pointer-events-none absolute  bottom-0 left-1/2 hidden -translate-x-1/2 transform lg:block"
            aria-hidden="true"
          >
            <svg
              width="1360"
              height="578"
              viewBox="0 0 1360 578"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  x1="50%"
                  y1="0%"
                  x2="50%"
                  y2="100%"
                  id="illustration-01"
                >
                  <stop stopColor="#FFF" offset="0%" />
                  <stop stopColor="#EAEAEA" offset="77.402%" />
                  <stop stopColor="#DFDFDF" offset="100%" />
                </linearGradient>
              </defs>
              <g fill="url(#illustration-01)" fillRule="evenodd">
                <circle cx="1232" cy="128" r="128" />
                <circle cx="155" cy="443" r="64" />
              </g>
            </svg>
          </div>

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
                        <Link href={"/new"} className="flex items-center gap-2">
                          Umfage erstellen{" "}
                          <AiOutlineArrowRight size={"1.5rem"} />
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
    </div>
  );
};

export default LandingPage;
