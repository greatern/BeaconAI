import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ImagePlus, Loader2, LocateFixed, X } from "lucide-react";

import LocationPicker from "../../components/map/LocationPicker";
import { createReport } from "../../features/reports/api";
import { CATEGORY_LABELS, INCIDENT_CATEGORIES } from "../../features/reports/types";

// Johannesburg — sensible default center until the browser supplies a real location.
const DEFAULT_CENTER = { lat: -26.2041, lng: 28.0473 };

const submitSchema = z.object({
  category: z.enum(INCIDENT_CATEGORIES),
  description: z.string().max(1000).optional(),
  address: z.string().max(255).optional(),
  latitude: z.number(),
  longitude: z.number(),
});

type SubmitForm = z.infer<typeof submitSchema>;

export default function SubmitReport() {
  const navigate = useNavigate();
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SubmitForm>({
    resolver: zodResolver(submitSchema),
    defaultValues: {
      category: "pothole",
      latitude: DEFAULT_CENTER.lat,
      longitude: DEFAULT_CENTER.lng,
    },
  });

  const mutation = useMutation({
    mutationFn: createReport,
    onSuccess: () => navigate("/map"),
    onError: () => setSubmitError("Couldn't submit your report. Please try again."),
  });

  function handleImageChange(file: File | null) {
    setImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((position) => {
      setValue("latitude", position.coords.latitude);
      setValue("longitude", position.coords.longitude);
    });
  }

  function onSubmit(values: SubmitForm) {
    setSubmitError(null);

    mutation.mutate({
      category: values.category,
      latitude: values.latitude,
      longitude: values.longitude,
      description: values.description,
      address: values.address,
      image,
    });
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Report an Incident</h1>
      <p className="text-stone-500 mb-8">
        Help your community stay informed — every report improves Beacon AI's picture of your area.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="beacon-card p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1.5">Category</label>
            <select
              className="w-full rounded-xl border border-stone-200 px-4 py-2.5 outline-none focus:border-primary"
              {...register("category")}
            >
              {INCIDENT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {CATEGORY_LABELS[category]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Description (optional)</label>
            <textarea
              rows={3}
              placeholder="What's happening? Any details that would help others understand the risk."
              className="w-full rounded-xl border border-stone-200 px-4 py-2.5 outline-none focus:border-primary resize-none"
              {...register("description")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Address (optional)</label>
            <input
              placeholder="e.g. Corner of Jan Smuts Ave & 7th St"
              className="w-full rounded-xl border border-stone-200 px-4 py-2.5 outline-none focus:border-primary"
              {...register("address")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Photo (optional)</label>

            {imagePreview ? (
              <div className="relative w-40 h-40 rounded-xl overflow-hidden border border-stone-200">
                <img src={imagePreview} alt="Report preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleImageChange(null)}
                  className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="flex items-center gap-2 w-fit cursor-pointer rounded-xl border border-dashed border-stone-300 px-5 py-4 text-stone-500 hover:border-primary hover:text-primary">
                <ImagePlus size={18} />
                Upload a photo
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
                />
              </label>
            )}
          </div>
        </div>

        <div className="beacon-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium">Location</label>
            <button
              type="button"
              onClick={useCurrentLocation}
              className="flex items-center gap-1.5 text-sm text-primary font-medium"
            >
              <LocateFixed size={16} />
              Use my location
            </button>
          </div>

          <p className="text-stone-500 text-sm">Tap the map to drop a pin at the exact spot.</p>

          <Controller
            control={control}
            name="latitude"
            render={({ field: latField }) => (
              <Controller
                control={control}
                name="longitude"
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

          {(errors.latitude || errors.longitude) && (
            <p className="text-danger text-sm">Please select a valid location.</p>
          )}
        </div>

        {submitError && <p className="text-danger text-sm">{submitError}</p>}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="flex items-center justify-center gap-2 bg-primary text-white rounded-xl py-3 px-8 font-medium disabled:opacity-60"
        >
          {mutation.isPending && <Loader2 size={18} className="animate-spin" />}
          {mutation.isPending ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
}
