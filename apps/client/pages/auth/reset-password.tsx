import { toast } from "@/shadcn/hooks/use-toast";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Login({}) {
  const router = useRouter();

  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [view, setView] = useState("code");

  async function sendCode() {
    await fetch(`/api/v1/auth/password-reset/code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, uuid: router.query.token }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          toast({
            variant: "default",
            title: "Success",
            description: "A password reset email is on its way.",
          });
          setView("password");
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

  async function updatPassword() {
    if (password.length < 1) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Password cannot be empty.",
      });
    } else {
      await fetch(`/api/v1/auth/password-reset/password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, password }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            toast({
              variant: "default",
              title: "Success",
              description: "Password updated successfully.",
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
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <a href="https://archevi.com" target="_blank" rel="noopener noreferrer">
          <img
            className="mx-auto h-36 w-auto"
            src="/logo.svg"
            alt="Archevi logo"
          />
        </a>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
          Reset Password
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {view === "code" ? (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                sendCode();
              }}
            >
              <div>
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-foreground"
                >
                  Code
                </label>
                <div className="mt-1">
                  <input
                    id="code"
                    name="code"
                    type="text"
                    autoComplete="off"
                    required
                    onChange={(e) => setCode(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-input rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-ring focus:border-ring sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
                >
                  Check Code
                </button>
              </div>
            </form>
          ) : (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                updatPassword();
              }}
            >
              <div>
                <label
                  htmlFor="new-password"
                  className="block text-sm font-medium text-foreground"
                >
                  New Password
                </label>
                <div className="mt-1">
                  <input
                    id="new-password"
                    name="new-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-input rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-ring focus:border-ring sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
                >
                  Change Password
                </button>
              </div>
            </form>
          )}
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
