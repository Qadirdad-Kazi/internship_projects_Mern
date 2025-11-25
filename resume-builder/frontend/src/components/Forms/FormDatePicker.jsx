import { forwardRef } from 'react'
import { Calendar, AlertCircle } from 'lucide-react'

const FormDatePicker = forwardRef(({ 
  label, 
  name, 
  value, 
  onChange, 
  onBlur,
  error, 
  required = false,
  disabled = false,
  min,
  max,
  className = '',
  ...props 
}, ref) => {
  // Convert date to YYYY-MM-DD format for input
  const formatDateForInput = (date) => {
    if (!date) return ''
    if (typeof date === 'string') {
      return date.split('T')[0] // Handle ISO strings
    }
    if (date instanceof Date) {
      return date.toISOString().split('T')[0]
    }
    return date
  }

  const handleChange = (e) => {
    const newValue = e.target.value
    if (onChange) {
      // Create a proper event object with the date value
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          name,
          value: newValue ? new Date(newValue) : null
        }
      }
      onChange(syntheticEvent)
    }
  }

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          id={name}
          name={name}
          type="date"
          value={formatDateForInput(value)}
          onChange={handleChange}
          onBlur={onBlur}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          className={`
            block w-full px-3 py-2 border rounded-md shadow-sm 
            focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${error 
              ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300'
            }
          `}
          {...props}
        />
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
})

FormDatePicker.displayName = 'FormDatePicker'

export default FormDatePicker