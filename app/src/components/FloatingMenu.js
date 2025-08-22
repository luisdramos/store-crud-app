import React, {useState, useRef, useEffect} from "react";
import { Plus, Minus, Menu, X} from "lucide-react";
import "../styles/FloatingMenu.css";

const FloatingMenu = ({ onAddPoint, onDeletePoint, onEditPoint, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const menuRef = useRef(null);

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Ocultar/mostrar menú al hacer scroll (opcional)
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      if (window.scrollY > lastScrollY + 50) {
        setIsVisible(false);
      } else if (window.scrollY < lastScrollY - 10) {
        setIsVisible(true);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddPoint = () => {
    setIsOpen(false);
    onAddPoint?.();
  };

  const handleDeletePoint = () => {
    setIsOpen(false);
    onDeletePoint?.();
  };

  const handleEditPoint = () => {
    setIsOpen(false);
    onEditPoint?.();
  };

  return (
    <div 
      ref={menuRef}
      className={`floating-menu ${className} ${isVisible ? 'visible' : 'hidden'}`}
      style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 1000 }}
    >
      {/* Botón principal del menú */}
      <button
        className="menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Menú desplegable */}
      {isOpen && (
        <div className="menu-content">
          <div className="menu-header">
            <h3>Acciones</h3>
          </div>
          
          <div className="menu-items">
            <button 
              className="menu-item add"
              onClick={handleAddPoint}
            >
              <Plus size={18} />
              <span>Alta de Punto</span>
            </button>

            <button 
              className="menu-item delete"
              onClick={handleDeletePoint}
            >
              <Minus size={18} />
              <span>Baja de Punto</span>
            </button>

            <button 
              className="menu-item edit"
              onClick={handleEditPoint}
            >
              <Minus size={18} />
              <span>Editar Punto</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingMenu;