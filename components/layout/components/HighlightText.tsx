interface Props {
  text: string;
  query: string;
}

const HighlightText = ({ text, query }: Props) => {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) return <>{text}</>;

  const index = text.toLowerCase().indexOf(normalizedQuery.toLowerCase());

  if (index === -1) return <>{text}</>;

  const before = text.slice(0, index);
  const matched = text.slice(index, index + normalizedQuery.length);
  const after = text.slice(index + normalizedQuery.length);

  return (
    <>
      {before}
      <mark className="rounded bg-green-200 px-0.5 text-green-900">
        {matched}
      </mark>
      {after}
    </>
  );
};

export default HighlightText;
