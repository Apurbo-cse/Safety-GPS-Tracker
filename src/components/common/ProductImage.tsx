import Image, { type ImageProps } from "next/image";

/**
 * next/image for product pictures. Files in /public are optimised as usual; pictures uploaded through the
 * admin panel are served by the API (https://…/media/<id>) and are already compressed, so they load as-is.
 */
export default function ProductImage({ alt, unoptimized, ...props }: ImageProps) {
  const external = typeof props.src === "string" && /^https?:\/\//.test(props.src);
  return <Image alt={alt} unoptimized={external || unoptimized} {...props} />;
}
