import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { Location } from "react-router-dom";
import { isAxiosError } from "axios";
import { Loader2, Lock, Mail } from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginForm) {
    setFormError(null);

    try {
      await login(values);

      const redirectTo = (location.state as { from?: Location })?.from?.pathname ?? "/dashboard";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 401) {
        setFormError("Invalid email or password.");
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
      <p className="text-stone-500 mb-8">Sign in to your Beacon AI account.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">Email</label>
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border border-stone-200 pl-11 pr-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              {...registerField("email")}
            />
          </div>
          {errors.email && (
            <p className="text-danger text-sm mt-1.5">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Password</label>
          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full rounded-xl border border-stone-200 pl-11 pr-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              {...registerField("password")}
            />
          </div>
          {errors.password && (
            <p className="text-danger text-sm mt-1.5">{errors.password.message}</p>
          )}
        </div>

        {formError && (
          <p className="text-danger text-sm bg-danger/5 border border-danger/10 rounded-lg px-3 py-2">
            {formError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white rounded-xl py-3.5 font-medium transition hover:opacity-90 disabled:opacity-60"
        >
          {isSubmitting && <Loader2 size={18} className="animate-spin" />}
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="text-center text-stone-500 mt-8">
        Don't have an account?{" "}
        <Link to="/register" className="text-primary font-semibold">
          Create one
        </Link>
      </p>
    </div>
  );
}
