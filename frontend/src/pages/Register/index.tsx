import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";

import { useAuth } from "../../context/AuthContext";

const registerSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterForm) {
    setFormError(null);

    try {
      await registerUser(values);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 400) {
        setFormError("An account with that email already exists.");
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Create your account</h1>
      <p className="text-stone-500 mb-8">
        Join Beacon AI and start tracking what matters in your community.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">First name</label>
            <input
              className="w-full rounded-xl border border-stone-200 px-4 py-2.5 outline-none focus:border-primary"
              {...registerField("first_name")}
            />
            {errors.first_name && (
              <p className="text-danger text-sm mt-1">{errors.first_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Last name</label>
            <input
              className="w-full rounded-xl border border-stone-200 px-4 py-2.5 outline-none focus:border-primary"
              {...registerField("last_name")}
            />
            {errors.last_name && (
              <p className="text-danger text-sm mt-1">{errors.last_name.message}</p>
            )}
          </div>
        </div>

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
            autoComplete="new-password"
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
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="text-center text-stone-500 mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-primary font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
