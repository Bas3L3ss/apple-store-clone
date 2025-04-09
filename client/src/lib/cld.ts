import { Cloudinary } from "@cloudinary/url-gen";
import { CLOUDINARY_CLOUD_NAME } from "../constants";
console.log(CLOUDINARY_CLOUD_NAME);

export const cld = new Cloudinary({
  cloud: { cloudName: CLOUDINARY_CLOUD_NAME },
});
