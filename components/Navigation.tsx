import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";

export const Navigation = () => {
  return (
    <div className="w-96 h-full rounded-lg text-neutral-300 gap-2 flex flex-col">
      <h1 className="text-xl font-medium text-white py-2">CSGO Empire</h1>
      <p className="bg-neutral-900 px-4 py-2 rounded-md text-sm">Coinflip</p>
      <SignedIn>
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>
    </div>
  );
};
