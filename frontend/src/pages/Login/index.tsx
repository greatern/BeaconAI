import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { Location } from "react-router-dom";
import { isAxiosError } from "axios";

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
      <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
      <p className="text-stone-500 mb-8">Sign in to your Beacon AI account.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">Email</label>
          <input
            type="email"
            autoComplete="email"
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 outline-none focus:border-primary"
            {...registerField("email")}
          />
          {errors.email && (
            <p className="text-danger text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Password</label>
          <input
            type="password"
            autoComplete="current-password"
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 outline-none focus:border-primary"
            {...registerField("password")}
          />
          {errors.password && (
            <p className="text-danger text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        {formError && <p className="text-danger text-sm">{formError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-white rounded-xl py-3 font-medium disabled:opacity-60"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="text-center text-stone-500 mt-6">
        Don't have an account?{" "}
        <Link to="/register" className="text-primary font-medium">
          Create one
        </Link>
      </p>
    </div>
  );
}
