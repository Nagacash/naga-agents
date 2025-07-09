export const renderTextWithLinks = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s.,;!?)\]}]+)/g; // Improved URL regex
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-secondary hover:underline"
        >
          {part}
        </a>
      );
    }
    return part;
  });
};
