/**
 * Input Component - Demonstrates controlled components
 * A controlled component has its value managed by React state
 */

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}

export default function Input({
  label,
  placeholder,
  value,
  onChange,
  type = 'text'
}: InputProps) {
  return (
    <div>
      {label && <label className="block text-sm font-medium mb-2 text-gray-700">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
      />
    </div>
  );
}
