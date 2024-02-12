"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ImageInput from "./image-input";
import ImageManager from "./image-manager";
import { EXISTING_IMAGE_PAYLOAD } from "./images-constants";
import { FormInput, formSchema } from "./schemas";
import { update } from "./api";

export default function EditForm() {
  const { control, handleSubmit, watch, formState, getFieldState, getValues } =
    useForm<FormInput>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: "",
        images: {
          existingImages: EXISTING_IMAGE_PAYLOAD.map((image) => ({
            ...image,
            delete: false,
          })),
          newImages: [],
        },
      },
    });

  const onSubmit = (values: FormInput) => {
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
        return image.featured !== EXISTING_IMAGE_PAYLOAD[i].featured;
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

  const imagesErrorMessage = getFieldState("images", formState).error?.root
    ?.message;
  const nameErrorMessage = getFieldState("name", formState).error?.message;

  const images = watch("images");

  const newImageFeaturedCount = images.newImages.reduce(
    (count, image) => (image.featured ? count + 1 : count),
    0
  );

  const existingImageFeaturedCount = images.existingImages.reduce(
    (count, image) => (image.featured ? count + 1 : count),
    0
  );

  const totalFeaturedCount = newImageFeaturedCount + existingImageFeaturedCount;

  return (
    <div className="max-w-4xl border p-4 m-4 border-orange-500 space-y-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border border-orange-500 p-4 flex flex-col gap-2"
      >
        <h1>Edit Form</h1>
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

      <div className="border border-orange-500 p-4 space-y-2">
        <h2>Errors:</h2>
        <ul className="text-red-500">
          {nameErrorMessage && <li>name: {nameErrorMessage}</li>}
          {imagesErrorMessage && <li>images: {imagesErrorMessage}</li>}
        </ul>
      </div>
    </div>
  );
}