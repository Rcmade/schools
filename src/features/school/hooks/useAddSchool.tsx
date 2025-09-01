"use client";
import { client } from "@/lib/rpc";
import { getSignature, uploadToCloudinary } from "@/services/cloudinaryService";
import { schoolSchema, SchoolSchemaT } from "@/zodSchema/schoolSchema";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useGetBoardAndMedium from "./useGetBoardAndMedium";

// API setup
const api = client.main.admin.school.$post;

type ResponseType = InferResponseType<typeof api, 201>;
type RequestType = InferRequestType<typeof api>;

export const useAddSchool = () => {
  const queryClient = useQueryClient();
  const toastId = "school";

  const { data: boardAndMedium } = useGetBoardAndMedium();
  const form = useForm<SchoolSchemaT>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      name: "",
      board: "",
      medium: "",
      type: "",
      city: "",
      state: "",
      pinCode: "",
      address: "",
      feesMin: 0,
      feesMax: 0,
      phone: "",
      email: "",
      website: "",
      image: undefined,
    },
  });

  const { mutate, isPending } = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      let imgUrl = "";
      if (json.image instanceof File) {
        const signature = await getSignature();
        if (json.image) {
          const file = await uploadToCloudinary({
            signature: signature.signature,
            timestamp: signature.timestamp,
            upload_preset: signature.upload_preset,
            source: signature.source,
            img: json.image,
          });

          imgUrl = file;
        }
      }

      const res = await api({ json: { ...json, image: imgUrl } });
      if (!res.ok) throw res;

      const data = await res.json();

      return data;
    },
    onSuccess: ({ message }) => {
      toast.success(message, { id: toastId });
      setTimeout(() => {
        window.location.reload();
      }, 2500);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create school");
      console.error(error);
    },
  });

  const onSubmit = (values: SchoolSchemaT) => {
    toast.loading("Creating school...", { id: toastId });

    mutate({
      json: {
        ...values,
      },
    });
  };

  return {
    form,
    onSubmit,
    isLoading: isPending,
    boardAndMedium,
  };
};
