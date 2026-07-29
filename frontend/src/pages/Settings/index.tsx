import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import * as authApi from "../../features/auth/api";

const passwordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z.string().min(8, "New password must be at least 8 characters"),
    confirm_password: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

type PasswordForm = z.infer<typeof passwordSchema>;

export default function Settings() {
  const { deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) });

  const deleteMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => navigate("/", { replace: true }),
  });

  async function onSubmit(values: PasswordForm) {
    setPasswordError(null);
    setPasswordSaved(false);

    try {
      await authApi.changePassword({
        current_password: values.current_password,
        new_password: values.new_password,
      });

      setPasswordSaved(true);
      reset();
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 401) {
        setPasswordError("Your current password is incorrect.");
      } else {
        setPasswordError("Couldn't update your password. Please try again.");
      }
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-stone-500">Manage your account security.</p>
      </div>

      <div className="beacon-card p-6 space-y-5">
        <h2 className="font-semibold text-lg">Change Password</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Current password</label>
            <input
              type="password"
              autoComplete="current-password"
              className="w-full rounded-xl border border-stone-200 px-4 py-2.5 outline-none focus:border-primary"
              {...register("current_password")}
            />
            {errors.current_password && (
              <p className="text-danger text-sm mt-1">{errors.current_password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">New password</label>
            <input
              type="password"
              autoComplete="new-password"
              className="w-full rounded-xl border border-stone-200 px-4 py-2.5 outline-none focus:border-primary"
              {...register("new_password")}
            />
            {errors.new_password && (
              <p className="text-danger text-sm mt-1">{errors.new_password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Confirm new password</label>
            <input
              type="password"
              autoComplete="new-password"
              className="w-full rounded-xl border border-stone-200 px-4 py-2.5 outline-none focus:border-primary"
              {...register("confirm_password")}
            />
            {errors.confirm_password && (
              <p className="text-danger text-sm mt-1">{errors.confirm_password.message}</p>
            )}
          </div>

          {passwordError && <p className="text-danger text-sm">{passwordError}</p>}

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-white rounded-xl py-3 px-8 font-medium disabled:opacity-60"
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </button>

            {passwordSaved && (
              <span className="flex items-center gap-1.5 text-success text-sm">
                <CheckCircle2 size={16} />
                Password updated
              </span>
            )}
          </div>
        </form>
      </div>

      <div className="beacon-card p-6 space-y-4 border border-danger/20">
        <div className="flex items-center gap-2 text-danger">
          <AlertTriangle size={20} />
          <h2 className="font-semibold text-lg">Danger Zone</h2>
        </div>

        <p className="text-stone-500 text-sm">
          Deleting your account permanently removes your profile and every report you've submitted.
          This can't be undone.
        </p>

        {!confirmingDelete ? (
          <button
            onClick={() => setConfirmingDelete(true)}
            className="rounded-xl border border-danger text-danger px-5 py-2.5 font-medium"
          >
            Delete Account
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
              className="rounded-xl bg-danger text-white px-5 py-2.5 font-medium disabled:opacity-60"
            >
              {deleteMutation.isPending ? "Deleting..." : "Yes, delete my account"}
            </button>
            <button
              onClick={() => setConfirmingDelete(false)}
              className="rounded-xl border border-stone-200 px-5 py-2.5 font-medium"
            >
              Cancel
            </button>
          </div>
        )}

        {deleteMutation.isError && (
          <p className="text-danger text-sm">Couldn't delete your account. Please try again.</p>
        )}
      </div>
    </div>
  );
}
