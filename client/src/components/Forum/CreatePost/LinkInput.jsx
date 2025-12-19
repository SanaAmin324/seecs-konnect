const LinkInput = ({ value, onChange }) => {
  return (
    <input
      type="url"
      placeholder="https://example.com"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
      required
    />
  );
};

export default LinkInput;
