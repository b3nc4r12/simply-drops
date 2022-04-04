import { ClientConfig, createClient } from "next-sanity"
import createImageUrlBuilder from "@sanity/image-url"
import type { SanityClient } from "@sanity/client"
import type { ImageUrlBuilder } from "@sanity/image-url/lib/types/builder"
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"

const config: ClientConfig = {
    dataset: process.env.sanity_dataset || "production",
    projectId: process.env.sanity_project_id || "",
    apiVersion: "2021-10-21",
    useCdn: process.env.NODE_ENV === "production"
}

export const sanityClient: SanityClient = createClient(config);
export const urlFor = (src: SanityImageSource): ImageUrlBuilder => createImageUrlBuilder(config).image(src);