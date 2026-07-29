import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import LocationPicker from "../../components/map/LocationPicker";

const DEFAULT_CENTER = { lat: -26.2041, lng: 28.0473 }; // Johannesburg

const profileSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
  home_lat: z.number(),
  home_lng: z.number(),
  work_lat: z.number(),
  work_lng: z.number(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: user?.first_name ?? "",
      last_name: user?.last_name ?? "",
      phone: user?.phone ?? "",
      home_lat: user?.home_lat ?? DEFAULT_CENTER.lat,
      home_lng: user?.home_lng ?? DEFAULT_CENTER.lng,
      work_lat: user?.work_lat ?? DEFAULT_CENTER.lat,
      work_lng: user?.work_lng ?? DEFAULT_CENTER.lng,
    },
  });

  async function onSubmit(values: ProfileForm) {
    setError(null);
    setSaved(false);

    try {
      await updateProfile(values);
      setSaved(true);
    } catch {
      setError("Couldn't save your changes. Please try again.");
    }
  }

  if (!user) return null;

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Profile</h1>
      <p className="text-stone-500 mb-8">
        Beacon AI uses your home and work locations to personalize the risks you see.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="beacon-card p-6 space-y-5">
          <h2 className="font-semibold text-lg">Personal Info</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">First name</label>
              <input
                className="w-full rounded-xl border border-stone-200 px-4 py-2.5 outline-none focus:border-primary"
                {...register("first_name")}
              />
              {errors.first_name && (
                <p className="text-danger text-sm mt-1">{errors.first_name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Last name</label>
              <input
                className="w-full rounded-xl border border-stone-200 px-4 py-2.5 outline-none focus:border-primary"
                {...register("last_name")}
              />
              {errors.last_name && (
                <p className="text-danger text-sm mt-1">{errors.last_name.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input
              value={user.email}
              disabled
              className="w-full rounded-xl border border-stone-200 px-4 py-2.5 bg-stone-50 text-stone-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Phone (optional)</label>
            <input
              placeholder="e.g. 082 123 4567"
              className="w-full rounded-xl border border-stone-200 px-4 py-2.5 outline-none focus:border-primary"
              {...register("phone")}
            />
          </div>
        </div>

        <div className="beacon-card p-6 space-y-4">
          <h2 className="font-semibold text-lg">Home Location</h2>
          <p className="text-stone-500 text-sm">Tap the map to set where you live.</p>

          <Controller
            control={control}
            name="home_lat"
            render={({ field: latField }) => (
              <Controller
                control={control}
                name="home_lng"
                render={({ field: lngField }) => (
                  <LocationPicker
                    value={{ lat: latField.value, lng: lngField.value }}
                    onChange={(position) => {
                      latField.onChange(position.lat);
                      lngField.onChange(position.lng);
                    }}
                  />
                )}
              />
            )}
          />
        </div>

        <div className="beacon-card p-6 space-y-4">
          <h2 className="font-semibold text-lg">Work Location</h2>
          <p className="text-stone-500 text-sm">Tap the map to set where you work.</p>

          <Controller
            control={control}
            name="work_lat"
            render={({ field: latField }) => (
              <Controller
                control={control}
                name="work_lng"
                render={({ field: lngField }) => (
                  <LocationPicker
                    value={{ lat: latField.value, lng: lngField.value }}
                    onChange={(position) => {
                      latField.onChange(position.lat);
                      lngField.onChange(position.lng);
                    }}
                  />
                )}
              />
            )}
          />
        </div>

        {error && <p className="text-danger text-sm">{error}</p>}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-white rounded-xl py-3 px-8 font-medium disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>

          {saved && (
            <span className="flex items-center gap-1.5 text-success text-sm">
              <CheckCircle2 size={16} />
              Saved
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
