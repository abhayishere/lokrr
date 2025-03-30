"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, User } from "lucide-react";
import { useAuthStore } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function SignUp() {
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  const register = useAuthStore((state) => state.register);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userName,
          password
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Registration failed");
      }

      toast({
        title: "Success",
        description: "Account created successfully! Please log in.",
      });
      router.push("/");
    } catch (error) {
      setErrorMessage(error.message || "Something went wrong");
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-gray-800/50 p-8 rounded-2xl backdrop-blur-lg border border-gray-700">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">LOKRR</h1>
          <h2 className="text-2xl font-semibold text-white">Create an account</h2>
          <p className="text-gray-400 mt-2">Sign up to get started</p>
        </div>

        <form onSubmit={handleSignUp} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="abcdxyz"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                  required
                />
              </div>
            </div>


            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
            {errorMessage && (
              <div className="text-center text-red-500 text-sm bg-red-500/10 p-2 rounded">
                {errorMessage}
              </div>
            )}
            <div className="text-center">
              <span className="text-gray-400">Already have an account?</span>
              <Link href="/">
                <Button
                  type="button"
                  variant="link"
                  className="text-emerald-400 hover:text-emerald-300 ml-2"
                >
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}