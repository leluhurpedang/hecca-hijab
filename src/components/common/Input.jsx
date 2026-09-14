import React from 'react';

export function Input({
  label,
  id,
  type = 'text',
  error,
  helperText,
  required = false,
  className = '',
  ...props
}) {
  const inputId = id || props.name;

  return (
    <div className="w-full text-left">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-espresso-900 uppercase tracking-wider mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        required={required}
        className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm text-espresso-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-mocha-400/40 focus:border-mocha-500 transition-colors ${
          error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200' : 'border-sand-200'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-stone-500">{helperText}</p>}
    </div>
  );
}

export function Textarea({
  label,
  id,
  error,
  helperText,
  required = false,
  className = '',
  rows = 3,
  ...props
}) {
  const inputId = id || props.name;

  return (
    <div className="w-full text-left">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-espresso-900 uppercase tracking-wider mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        required={required}
        className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm text-espresso-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-mocha-400/40 focus:border-mocha-500 transition-colors resize-y ${
          error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200' : 'border-sand-200'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-stone-500">{helperText}</p>}
    </div>
  );
}

export function Select({
  label,
  id,
  error,
  options = [],
  required = false,
  className = '',
  ...props
}) {
  const inputId = id || props.name;

  return (
    <div className="w-full text-left">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-espresso-900 uppercase tracking-wider mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <select
        id={inputId}
        required={required}
        className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm text-espresso-900 focus:outline-none focus:ring-2 focus:ring-mocha-400/40 focus:border-mocha-500 transition-colors ${
          error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200' : 'border-sand-200'
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}
