import {
  ClerkProvider,
  SignIn,
  SignInButton,
  SignOutButton,
  SignedOut,
  useUser,
} from "@clerk/nextjs";
import { useRouter } from "next/router";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./dropdown-menu";

// Use the useUser hook to get the Clerk.user object

export function UserNav() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  if (isSignedIn && user)
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {isSignedIn ? (
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={`${user?.profileImageUrl}`} alt="@shadcn" />
                <AvatarFallback></AvatarFallback>
              </Avatar>
            </Button>
          ) : (
            <div>
              <button
                onClick={() => SignIn({ afterSignInUrl: "/" })}
                className="btn"
              >
                Sign in
              </button>
            </div>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user?.fullName}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => router.push("/profile/my-polls")}
            >
              Meine Umfragen
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            <SignOutButton signOutCallback={() => router.push("/")} />
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  return <SignInButton afterSignInUrl="/" />;
}
