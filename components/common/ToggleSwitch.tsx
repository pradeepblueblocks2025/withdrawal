"use client";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export default function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
}: ToggleSwitchProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`
        relative
        inline-flex
        h-6
        w-11
        items-center
        rounded-full
        transition-all
        duration-300
        cursor-pointer
        focus:outline-none
        ${
          checked
            ? "bg-green-500"
            : "bg-slate-600"
        }
        ${disabled && "opacity-50 cursor-not-allowed"}
      `}
    >
      <span
        className={`
          inline-block
          h-4
          w-4
          transform
          rounded-full
          bg-white
          shadow
          transition-transform
          duration-300
          ${
            checked
              ? "translate-x-6"
              : "translate-x-1"
          }
        `}
      />
    </button>
  );
}