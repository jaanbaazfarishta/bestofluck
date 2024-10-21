// app/components/ui/sign.jsx

import { signIn, signOut } from "@/auth";

export function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("google")
      }}
    >
      <button className="sm:hidden text-2xl" type="submit">Signin with Google</button>
    </form>
  )
}

export function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button className="sm:hidden" type="submit">Sign Out</button>
    </form>
  );
}