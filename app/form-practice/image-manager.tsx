import { type Control, Controller } from "react-hook-form";
import { clsx } from "clsx";
import { ExistingImagePayload, FormInput, NewImagePayload } from "./schemas";
import { useEffect, useMemo } from "react";

function useImagePreviews(files: File[]) {
  const images = useMemo(
    () =>
      files.map((file) => ({
        ...file,
        preview: URL.createObjectURL(file),
      })),
    [files]
  );

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => images.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [images]);

  return images;
}

export default function ImageManager({
  control,
  featuredCount,
}: {
  control: Control<FormInput>;
  featuredCount: number;
}) {
  const tooManyFeatured = featuredCount > 2;

  return (
    <>
      <h2 className="text-lg font-bold">New Images</h2>
      <Controller
        control={control}
        name="images.newImages"
        render={({ field }) => {
          const newImagePreviews = useImagePreviews(
            field.value.map((image) => image.file)
          );

          return (
            <div className="grid grid-cols-4 gap-2 border border-orange-500 p-4">
              {newImagePreviews.map(({ preview }, index) => {
                const fieldValueItem = field.value[index];
                const isFeatured = fieldValueItem.featured;
                const featuredDisabled = tooManyFeatured && !isFeatured;

                return (
                  <div key={index} className="flex flex-col gap-2">
                    <img src={preview} className="aspect-square object-cover" />

                    <div className="flex flex-col gap-2">
                      <label
                        className={clsx(
                          "flex gap-2 bg-neutral-50 border border-dashed px-2",
                          featuredDisabled && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <input
                          type="checkbox"
                          disabled={featuredDisabled}
                          checked={isFeatured}
                          onChange={(e) => {
                            const newImages: NewImagePayload[] = [
                              ...field.value,
                            ];

                            newImages[index].featured = e.target.checked;

                            field.onChange(newImages);
                          }}
                        />
                        Featured
                      </label>

                      <button
                        className="flex gap-2 bg-neutral-50 border border-dashed px-2"
                        type="button"
                        onClick={() => {
                          const newImages = field.value.filter(
                            (_, i) => i !== index
                          );

                          field.onChange(newImages);
                        }}
                      >
                        Remove image
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        }}
      />

      <h2 className="text-lg font-bold">Existing Images</h2>
      <Controller
        control={control}
        name="images.existingImages"
        render={({ field }) => {
          return (
            <div className="grid grid-cols-4 gap-2 border border-orange-500 p-4">
              {field.value?.map(({ url }, index) => {
                const fieldValueItem = field.value.find(
                  (image) => image.url === url
                );

                if (!fieldValueItem) return null;

                const isFeatured = fieldValueItem.featured;
                const toDelete = fieldValueItem.delete;
                const featuredDisabled = tooManyFeatured && !isFeatured;

                return (
                  <div key={index} className="flex flex-col gap-2">
                    <img src={url} className="aspect-square object-cover" />

                    <div className="flex flex-col gap-2">
                      <label
                        className={clsx(
                          "flex gap-2 bg-neutral-50 border border-dashed px-2",
                          featuredDisabled && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={isFeatured}
                          disabled={toDelete || featuredDisabled}
                          onChange={(e) => {
                            const newImages: ExistingImagePayload[] = [
                              ...field.value,
                            ];

                            newImages[index].featured = e.target.checked;

                            field.onChange(newImages);
                          }}
                        />
                        Featured
                      </label>

                      <label className="flex gap-2 bg-neutral-50 border border-dashed px-2">
                        <input
                          type="checkbox"
                          checked={toDelete}
                          onChange={(e) => {
                            const newImages: ExistingImagePayload[] = [
                              ...field.value,
                            ];

                            newImages[index].delete = e.target.checked;
                            newImages[index].featured = false;

                            field.onChange(newImages);
                          }}
                        />
                        Delete
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        }}
      />
    </>
  );
}
