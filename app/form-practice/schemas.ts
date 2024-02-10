import { z } from "zod";

const ImageAction = Object.freeze({
  DELETE: "delete",
  UPDATE: "update",
  CREATE: "create",
});

const existingImagePayloadSchema = z.object({
  url: z.string(),
  featured: z.boolean(),
  delete: z.boolean().default(false),
});
export type ExistingImagePayload = z.infer<typeof existingImagePayloadSchema>;

const newImagePayloadSchema = z.object({
  file: z.instanceof(File),
  featured: z.boolean(),
});
export type NewImagePayload = z.infer<typeof newImagePayloadSchema>;

export const formSchema = z.object({
  name: z.string(),
  images: z
    .object({
      newImages: z.array(newImagePayloadSchema),
      existingImages: z.array(existingImagePayloadSchema),
    })
    .refine(
      ({ newImages, existingImages = [] }) => {
        return (
          [...newImages, ...existingImages].filter((image) => image.featured)
            .length < 4
        );
      },
      {
        message: "You can't have more than 3 featured images.",
        path: [],
      }
    ),
});
export type FormInput = z.infer<typeof formSchema>;

export const createServerSchema = z.object({
  name: z.string(),
  images: z.object({
    newImages: z.array(
      z.object({
        url: z.string(),
        featured: z.boolean(),
      })
    ),
  }),
});
export type CreateServerInput = z.infer<typeof createServerSchema>;

export const updateServerSchema = z.object({
  id: z.string(),
  name: z.string(),
  images: z.object({
    newImages: z.array(
      z.object({
        url: z.string(),
        featured: z.boolean(),
      })
    ),
    existingImages: z.array(
      z.object({
        url: z.string(),
        featured: z.boolean(),
        delete: z.boolean().optional(),
      })
    ),
  }),
});
export type UpdateServerInput = z.infer<typeof updateServerSchema>;
