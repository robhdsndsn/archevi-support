import { toast } from "@/shadcn/hooks/use-toast";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Login({}) {
  const router = useRouter();

  const [email, setEmail] = useState("");

  async function postData() {
    await fetch(`/api/v1/auth/password-reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, link: window.location.origin }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          toast({
            variant: "default",
            title: "Success",
            description: "Password reset email is on its way.",
          });
          router.push("/auth/login");
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description:
              "There was an error with this request. Please try again or contact support at hello@archevi.com.",
          });
        }
      });
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <a target="_blank" rel="noopener noreferrer" href="https://archevi.com">
          <img
            className="mx-auto h-36 w-auto"
            src="/logo.svg"
            alt="Archevi logo"
          />
        </a>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
          Request Password Reset
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              postData();
            }}
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-input rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-ring focus:border-ring sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  href="/auth/login"
                  className="font-medium text-primary hover:text-primary/80"
                >
                  Remember your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 text-center flex flex-col space-y-2">
          <a href="https://archevi.com" target="_blank" rel="noopener noreferrer">
            archevi.com
          </a>
        </div>
      </div>
    </div>
  );
}
