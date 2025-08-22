import React, { useState, useEffect, useCallback } from "react";
import { X, Save, AlertCircle } from "lucide-react";
import "../styles/Modal.css";

// Tipos de campos disponibles
const FIELD_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  EMAIL: 'email',
  PASSWORD: 'password',
  TEXTAREA: 'textarea',
  SELECT: 'select',
  DATE: 'date'
};

// Propiedades del modal
const Modal = ({
  isOpen,
  onClose,
  onSubmit,
  title = "Formulario",
  fields = [],
  initialData = {},
  submitText = "Guardar",
  cancelText = "Cancelar",
  size = "medium",
  showAlert = false,
  alertMessage = "",
  alertType = "error",
  isLoading = false
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const initializeFormData = useCallback(() => {
    const initialFormData = {};
    fields.forEach(field => {
      initialFormData[field.name] = initialData[field.name] || field.defaultValue || '';
    });
    setFormData(initialFormData);
    setErrors({});
  }, [fields, initialData]); 

  useEffect(() => {
    if (isOpen) {
      initializeFormData();
    }
  }, [isOpen, initializeFormData]); 
  
  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscape]); 

  const handleInputChange = useCallback((fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));

    // Limpiar error del campo al escribir
    setErrors(prev => ({
      ...prev,
      [fieldName]: ''
    }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};

    fields.forEach(field => {
      if (field.required && !formData[field.name]?.toString().trim()) {
        newErrors[field.name] = field.errorMessage || `${field.label} es requerido`;
      }

      if (field.pattern && formData[field.name]) {
        const regex = new RegExp(field.pattern);
        if (!regex.test(formData[field.name])) {
          newErrors[field.name] = field.patternMessage || `Formato de ${field.label} inválido`;
        }
      }

      if (field.validate && formData[field.name]) {
        const validationResult = field.validate(formData[field.name], formData);
        if (validationResult) {
          newErrors[field.name] = validationResult;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [fields, formData]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  }, [validateForm, onSubmit, formData]);

  const renderField = useCallback((field) => {
    const commonProps = {
      id: field.name,
      name: field.name,
      value: formData[field.name] || '',
      onChange: (e) => handleInputChange(field.name, e.target.value),
      className: `modal-input ${errors[field.name] ? 'error' : ''}`,
      placeholder: field.placeholder || `Ingrese ${field.label.toLowerCase()}`,
      disabled: isLoading,
      required: field.required
    };

    switch (field.type) {
      case FIELD_TYPES.TEXTAREA:
        return (
          <textarea
            {...commonProps}
            rows={field.rows || 4}
          />
        );

      case FIELD_TYPES.SELECT:
        return (
          <select {...commonProps}>
            <option value="">Seleccione una opción</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case FIELD_TYPES.NUMBER:
        return (
          <input
            {...commonProps}
            type="number"
            min={field.min}
            max={field.max}
            step={field.step}
          />
        );

      default:
        return (
          <input
            {...commonProps}
            type={field.type || FIELD_TYPES.TEXT}
          />
        );
    }
  }, [formData, errors, isLoading, handleInputChange]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className={`modal-container modal-${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button 
            className="modal-close-btn"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Cerrar modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Alert */}
        {showAlert && alertMessage && (
          <div className={`modal-alert modal-alert-${alertType}`}>
            <AlertCircle size={16} />
            <span>{alertMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-body">
            {fields.map((field) => (
              <div key={field.name} className="modal-field">
                <label htmlFor={field.name} className="modal-label">
                  {field.label}
                  {field.required && <span className="required">*</span>}
                </label>
                
                {renderField(field)}
                
                {field.helpText && (
                  <div className="modal-help">{field.helpText}</div>
                )}
                
                {errors[field.name] && (
                  <div className="modal-error">{errors[field.name]}</div>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="modal-btn modal-btn-cancel"
              disabled={isLoading}
            >
              {cancelText}
            </button>
            
            <button
              type="submit"
              className="modal-btn modal-btn-submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                <>
                  <Save size={16} />
                  {submitText}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
export { FIELD_TYPES };