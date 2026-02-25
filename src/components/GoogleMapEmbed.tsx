interface GoogleMapEmbedProps {
  address: string;
  className?: string;
}

export function GoogleMapEmbed({ address, className }: GoogleMapEmbedProps) {
  if (!address) return null;

  const encodedAddress = encodeURIComponent(address);

  return (
    <iframe
      className={className}
      width="100%"
      height="300"
      style={{ border: 0, borderRadius: "0.75rem" }}
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
      src={`https://www.google.com/maps/embed/v1/place?key=&q=${encodedAddress}`}
      title={`Map of ${address}`}
    />
  );
}
