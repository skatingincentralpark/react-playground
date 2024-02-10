import {
  CreateServerInput,
  UpdateServerInput,
  createServerSchema,
  updateServerSchema,
} from "./schemas";
import { EXISTING_IMAGE_PAYLOAD } from "./images-constants";

function getImageMeta(url: string, featured: boolean) {
  return {
    url,
    featured,
    width: 1,
    height: 1,
  };
}

export function create(input: CreateServerInput) {
  return createServerSchema.parse(input);
}
export function update(input: UpdateServerInput) {
  console.log(updateServerSchema.parse(input));

  const newImages = input.images.newImages.map((image) => {
    return getImageMeta(image.url, image.featured);
  });

  const existingImages = input.images.existingImages.map((image) => {
    return getImageMeta(image.url, image.featured);
  });

  return "Success";
}

export function getSpot({ enabled = true }) {
  if (!enabled) return null;

  return {
    id: "2",
    name: "Spot",
    images: EXISTING_IMAGE_PAYLOAD,
  };
}
