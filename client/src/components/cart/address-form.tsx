import { LocationSuggestion, ShippingAddress } from "@/src/@types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef, useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { toast } from "sonner";
import axios from "axios";

// Lazy load Leaflet
const LeafletMap = React.lazy(() => import("./address-map"));

const addressSchema = z.object({
  fullAddress: z.string().min(1, "Address is required"),
  line1: z.string().min(1, "Address line 1 is required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
});

const AddressForm = ({
  onSave,
  initialValue = null,
}: {
  onSave: (s: ShippingAddress) => void;
  initialValue: ShippingAddress | null;
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mapCoordinates, setMapCoordinates] = useState({
    lat: initialValue?.coordinates?.lat || 40.7128,
    lng: initialValue?.coordinates?.lng || -74.006,
  });

  const debounceRef = useRef<any | null>(null);
  type AddressFormValues = z.infer<typeof addressSchema>;
  const form = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: initialValue || {
      fullAddress: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      coordinates: {
        lat: 40.7128,
        lng: -74.006,
      },
    },
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      if (value) {
        try {
          setIsLoading(true);
          const response = await axios.get<LocationSuggestion[]>(
            `https://nominatim.openstreetmap.org/search?q=${value}&format=json&addressdetails=1`
          );
          setSuggestions(response.data);
        } catch (error) {
          console.error("Error fetching location suggestions:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 500);
  };

  const handleSuggestionClick = (place: LocationSuggestion) => {
    const { lat, lon, display_name, address } = place;

    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lon);

    // Update map coordinates
    setMapCoordinates({
      lat: parsedLat,
      lng: parsedLng,
    });

    const line1 = [address.house_number, address.road]
      .filter(Boolean)
      .join(" ");
    const city = address.city || address.town || address.county || "";
    const state = address.state || "";
    const postalCode = address.postcode || "";
    const country = address.country || "";

    form.setValue("fullAddress", display_name);
    form.setValue("line1", line1);
    form.setValue("city", city);
    form.setValue("state", state);
    form.setValue("postalCode", postalCode);
    form.setValue("country", country);
    form.setValue("coordinates", {
      lat: parsedLat,
      lng: parsedLng,
    });

    setQuery(display_name);
    setSuggestions([]);
  };

  const clearInput = () => {
    setQuery("");
    setSuggestions([]);
  };

  const onSubmit = (data: AddressFormValues) => {
    onSave(data);
  };

  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      toast.error("Saving address incomplete!", {
        description:
          "We suggest you to use recommended search and have map pinned to the exact location",
      });
      console.log(form.formState.errors);
    }
  }, [form.formState.errors]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="relative">
          <FormItem>
            <FormLabel className="font-medium text-gray-700">
              Search Address
            </FormLabel>
            <div className="flex items-center">
              <FormControl>
                <Input
                  placeholder="Start typing your address..."
                  value={query}
                  onChange={handleSearch}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </FormControl>
              {query && (
                <button
                  type="button"
                  className="absolute right-3 text-gray-400 hover:text-gray-600"
                  onClick={clearInput}
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <FormMessage />
          </FormItem>

          {isLoading && (
            <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md space-y-5 bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Skeleton className="h-6 bg-gray-200 rounded animate-pulse"></Skeleton>
              <Skeleton className="h-6 bg-gray-200 rounded animate-pulse"></Skeleton>
              <Skeleton className="h-6 bg-gray-200 rounded animate-pulse"></Skeleton>
              <Skeleton className="h-6 bg-gray-200 rounded animate-pulse"></Skeleton>
            </div>
          )}
          {!isLoading && (
            <>
              {suggestions.length > 0 && (
                <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {suggestions.map((item, idx) => (
                    <li
                      key={idx}
                      onClick={() => handleSuggestionClick(item)}
                      className="relative cursor-pointer select-none px-4 py-2 text-gray-900 hover:bg-gray-100"
                    >
                      {item.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>

        <div className="h-64 rounded-lg border border-gray-200 mt-4 mb-4">
          <Suspense
            fallback={
              <div className="h-full flex items-center justify-center bg-gray-100">
                <Skeleton className="h-full w-full bg-gray-200 rounded" />
              </div>
            }
          >
            <LeafletMap
              coordinates={mapCoordinates}
              onPositionChange={(coords) => {
                form.setValue("coordinates", coords);
                setMapCoordinates(coords);
              }}
            />
          </Suspense>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="line1"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-gray-700">
                  Address Line 1
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="line2"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-gray-700">
                  Address Line 2 (optional)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-gray-700">
                  City
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-gray-700">
                  State
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-gray-700">
                  Postal Code
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-gray-700">
                  Country
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="coordinates"
          render={() => <div className="hidden"></div>}
        />

        <Button
          type="submit"
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Save Address
        </Button>
      </form>
    </Form>
  );
};

export default AddressForm;
