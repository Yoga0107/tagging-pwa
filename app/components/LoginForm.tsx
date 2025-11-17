"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

 const handleLogin = async () => {
  const res = await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  if (res?.error) {
    toast({
      title: "Login Failed",
      description: "Email atau password salah",
      variant: "destructive",
    });
    return;
  }

  toast({
    title: "Login Success",
    description: "Anda berhasil login",
  });


  window.location.href = "/dashboard";
};


  return (
    <div className="p-6 bg-white rounded-xl shadow-md w-full max-w-sm">
      <h1 className="text-xl font-bold mb-4">Login</h1>

      <Input
        placeholder="Email"
        className="mb-3"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        placeholder="Password"
        type="password"
        className="mb-4"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button className="w-full" onClick={handleLogin}>
        Login
      </Button>
    </div>
  );
}
