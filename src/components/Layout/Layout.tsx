import React, { PropsWithChildren } from "react";
import { MainNav } from "../ui/main-nav";
import { UserNav } from "../ui/user-nav";
const Layout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className=" left-0 top-0 z-50 flex w-full flex-col">
        <div className="flex justify-center border-b">
          <div className="flex h-16 w-full items-center px-2 lg:w-[60%]">
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <UserNav />
            </div>
          </div>{" "}
        </div>{" "}
        {children}
      </div>
    </>
  );
};
export default Layout;
