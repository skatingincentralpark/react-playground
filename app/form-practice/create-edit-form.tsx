"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ImageInput from "./image-input";
import ImageManager from "./image-manager";
import { FormInput, formSchema } from "./schemas";
import { create, getSpot, update } from "./api";

export default function CreateEditForm({ mode }: { mode: "create" | "edit" }) {
  const fetchedSpot = getSpot({ enabled: mode === "edit" });

  const { control, handleSubmit, watch, formState, getFieldState } =
    useForm<FormInput>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: "",
        images: {
          ...(fetchedSpot && {
            existingImages: fetchedSpot.images.map((image) => ({
              ...image,
              delete: false,
            })),
          }),
          newImages: [],
        },
      },
    });

  const onSubmitEdit = (values: FormInput) => {
    const newImageUrls = values.images.newImages.map(
      (image) => `https://cloudfront.com/new-${image.file.name}`
    );

    const newImagesPayload = newImageUrls.map((url, i) => ({
      url,
      featured: values.images.newImages[i].featured,
    }));

    const changedExistingImages = values.images.existingImages.filter(
      (image, i) => {
        if (image.delete) return true;
        return image.featured !== fetchedSpot?.images[i].featured;
      }
    );

    console.log(
      update({
        id: "1",
        name: values.name,
        images: {
          newImages: newImagesPayload,
          existingImages: changedExistingImages,
        },
      })
    );
  };

  const onSubmitCreate = (values: FormInput) => {
    const newImageUrls = values.images.newImages.map(
      (image) => `https://cloudfront.com/new-${image.file.name}`
    );

    const newImagesPayload = newImageUrls.map((url, i) => ({
      url,
      featured: values.images.newImages[i].featured,
    }));

    console.log(
      create({
        name: values.name,
        images: {
          newImages: newImagesPayload,
        },
      })
    );
  };

  const onSubmit = mode === "edit" ? onSubmitEdit : onSubmitCreate;

  const images = watch("images");
  const totalFeaturedCount = getTotalFeaturedCount(images);

  return (
    <div className="max-w-4xl border p-4 m-4 border-orange-500 space-y-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border border-orange-500 p-4 flex flex-col gap-2"
      >
        <h1>Create and Edit Form</h1>
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <input {...field} className="border" placeholder="Name" />
          )}
        />
        <ImageInput control={control} />
        <ImageManager control={control} featuredCount={totalFeaturedCount} />

        <div className="flex flex-col gap-2"></div>

        <button className="text-white bg-orange-500 border px-2" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

function getTotalFeaturedCount(images: FormInput["images"]) {
  const newImageFeaturedCount = images.newImages.reduce(
    (count, image) => (image.featured ? count + 1 : count),
    0
  );

  const existingImageFeaturedCount = images.existingImages.reduce(
    (count, image) => (image.featured ? count + 1 : count),
    0
  );

  return newImageFeaturedCount + existingImageFeaturedCount;
}
