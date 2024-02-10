import { type Control, Controller } from "react-hook-form";
import { FormInput, NewImagePayload } from "./schemas";

export default function ImageInput({
  control,
}: {
  control: Control<FormInput>;
}) {
  return (
    <Controller
      control={control}
      name="images.newImages"
      render={({ field }) => (
        <input
          type="file"
          multiple
          {...field}
          value={undefined}
          onChange={(e) => {
            if (!e.target.files) e.preventDefault();
            const files = e.target.files;

            if (files) {
              const images: NewImagePayload[] = Array.from(files).map(
                (file) => ({
                  file,
                  featured: false,
                })
              );
              console.log(images.map((x) => x.file.name));

              field.onChange(images);
            }
          }}
        />
      )}
    />
  );
}
