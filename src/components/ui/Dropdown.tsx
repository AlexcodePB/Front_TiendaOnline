'use client';

import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'ghost';
}

export default function Dropdown({
  options,
  value,
  placeholder = "Seleccionar...",
  onChange,
  className = "",
  disabled = false,
  error = false,
  size = 'md',
  variant = 'default'
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    if (!disabled) {
      onChange(optionValue);
      setIsOpen(false);
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  const variantClasses = {
    default: `border border-gray-300 bg-white hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
      error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
    }`,
    minimal: `border-b border-gray-200 bg-transparent hover:border-gray-400 focus:border-gray-900 rounded-none ${
      error ? 'border-red-300 focus:border-red-500' : ''
    }`,
    ghost: `border border-transparent bg-gray-50 hover:bg-gray-100 focus:bg-white focus:border-gray-300 ${
      error ? 'bg-red-50 hover:bg-red-100' : ''
    }`
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "w-full flex items-center justify-between rounded-lg transition-all duration-200 outline-none",
          sizeClasses[size],
          variantClasses[variant],
          disabled && "opacity-50 cursor-not-allowed bg-gray-50",
          isOpen && "ring-2 ring-blue-500 ring-opacity-20"
        )}
      >
        <span className={cn(
          "truncate",
          !selectedOption && "text-gray-400"
        )}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          className={cn(
            "w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-2",
            isOpen && "rotate-180"
          )} 
        />
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto animate-in fade-in-0 zoom-in-95 duration-200">
          {options.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">
              No hay opciones disponibles
            </div>
          ) : (
            options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                disabled={option.disabled}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm transition-colors duration-150 flex items-center justify-between",
                  option.disabled 
                    ? "text-gray-400 cursor-not-allowed" 
                    : "text-gray-900 hover:bg-gray-50 focus:bg-gray-50 cursor-pointer",
                  option.value === value && !option.disabled && "bg-blue-50 text-blue-700"
                )}
              >
                <span className="truncate">{option.label}</span>
                {option.value === value && (
                  <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

interface MultiSelectProps {
  options: DropdownOption[];
  values?: string[];
  placeholder?: string;
  onChange: (values: string[]) => void;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  maxHeight?: string;
}

export function MultiSelect({
  options,
  values = [],
  placeholder = "Seleccionar múltiples...",
  onChange,
  className = "",
  disabled = false,
  error = false,
  maxHeight = "max-h-60"
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOptions = options.filter(option => values.includes(option.value));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    if (!disabled) {
      const newValues = values.includes(optionValue)
        ? values.filter(v => v !== optionValue)
        : [...values, optionValue];
      onChange(newValues);
    }
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2 text-sm border rounded-lg transition-all duration-200 outline-none",
          error 
            ? "border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500" 
            : "border-gray-300 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          disabled && "opacity-50 cursor-not-allowed bg-gray-50",
          isOpen && "ring-2 ring-blue-500 ring-opacity-20"
        )}
      >
        <div className="flex flex-wrap gap-1 min-h-[1.25rem]">
          {selectedOptions.length > 0 ? (
            selectedOptions.map((option, index) => (
              <span
                key={option.value}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800"
              >
                {option.label}
                {index < selectedOptions.length - 1 && ","}
              </span>
            ))
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>
        <ChevronDown 
          className={cn(
            "w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-2",
            isOpen && "rotate-180"
          )} 
        />
      </button>

      {isOpen && !disabled && (
        <div className={cn(
          "absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-auto animate-in fade-in-0 zoom-in-95 duration-200",
          maxHeight
        )}>
          {options.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">
              No hay opciones disponibles
            </div>
          ) : (
            options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                disabled={option.disabled}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm transition-colors duration-150 flex items-center justify-between",
                  option.disabled 
                    ? "text-gray-400 cursor-not-allowed" 
                    : "text-gray-900 hover:bg-gray-50 focus:bg-gray-50 cursor-pointer",
                  values.includes(option.value) && !option.disabled && "bg-blue-50 text-blue-700"
                )}
              >
                <span className="truncate">{option.label}</span>
                {values.includes(option.value) && (
                  <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}