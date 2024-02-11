"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ImageInput from "./image-input";
import ImageManager from "./image-manager";
import { FormInput, formSchema } from "./schemas";
import { create } from "./api";

export default function CreateForm() {
  const { control, handleSubmit, watch, formState, getFieldState } =
    useForm<FormInput>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: "",
        images: {
          newImages: [],
        },
      },
    });

  const onSubmit = (values: FormInput) => {
    const newImageUrls = values.images.newImages.map(
      (image) => `https://cloudfront.com/new-${image.file.name}`,
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
      }),
    );
  };

  const imagesErrorMessage = getFieldState("images", formState).error?.root
    ?.message;
  const nameErrorMessage = getFieldState("name", formState).error?.message;
  console.log(formState.errors);

  const images = watch("images");

  const newImageFeaturedCount = images.newImages.reduce(
    (count, image) => (image.featured ? count + 1 : count),
    0,
  );

  const totalFeaturedCount = newImageFeaturedCount;

  return (
    <div className="m-4 max-w-4xl space-y-4 border border-orange-500 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 border border-orange-500 p-4"
      >
        <h1>Create Form</h1>
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

        <button className="border bg-orange-500 px-2 text-white" type="submit">
          Submit
        </button>
      </form>

      <div className="space-y-2 border border-orange-500 p-4">
        <h2>Errors:</h2>
        <ul className="text-red-500">
          {nameErrorMessage && <li>name: {nameErrorMessage}</li>}
          {imagesErrorMessage && <li>images: {imagesErrorMessage}</li>}
        </ul>
      </div>
    </div>
  );
}
