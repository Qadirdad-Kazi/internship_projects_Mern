import { forwardRef } from 'react'
import { AlertCircle } from 'lucide-react'

const FormTextarea = forwardRef(({ 
  label, 
  name, 
  value, 
  onChange, 
  onBlur,
  error, 
  placeholder, 
  required = false,
  disabled = false,
  rows = 3,
  maxLength,
  className = '',
  ...props 
}, ref) => {
  const charCount = value ? value.length : 0
  
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <textarea
          ref={ref}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          className={`
            block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 
            focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            resize-vertical
            ${error 
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300'
            }
          `}
          {...props}
        />
        {error && (
          <div className="absolute top-2 right-2 pointer-events-none">
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
        )}
      </div>
      <div className="flex justify-between">
        <div>
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </div>
        {maxLength && (
          <p className={`text-xs ${
            charCount > maxLength * 0.9 ? 'text-orange-600' : 'text-gray-500'
          }`}>
            {charCount}/{maxLength}
          </p>
        )}
      </div>
    </div>
  )
})

FormTextarea.displayName = 'FormTextarea'

export default FormTextarea