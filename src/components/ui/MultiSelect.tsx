"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useState } from "react";

interface MultiSelectProps {
  label?: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  label,
  options,
  selected,
  onChange,
  placeholder = "Select...",
  className,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((s) => s !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex min-h-[38px] cursor-pointer flex-wrap gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus-within:border-jazz-500 focus-within:ring-1 focus-within:ring-jazz-500"
        >
          {selected.length === 0 && (
            <span className="py-0.5 text-gray-400">{placeholder}</span>
          )}
          {selected.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1 rounded-md bg-jazz-50 px-2 py-0.5 text-xs font-medium text-jazz-700"
            >
              {s}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(s);
                }}
                className="text-jazz-400 hover:text-jazz-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        {isOpen && (
          <div className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => toggle(opt)}
                className={cn(
                  "block w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50",
                  selected.includes(opt) && "bg-jazz-50 text-jazz-700"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
