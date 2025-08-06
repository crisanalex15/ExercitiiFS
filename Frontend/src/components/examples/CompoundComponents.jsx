import React, { createContext, useContext, useState } from 'react';

/**
 * 🧩 COMPOUND COMPONENTS PATTERN
 * 
 * Pattern avansat pentru componente flexibile și reutilizabile
 * Exemplu: Modal compound component pentru CarList
 */

// Context pentru starea internă a Modal-ului
const ModalContext = createContext();

// Hook pentru accesarea contextului
const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('Modal components must be used within Modal');
  }
  return context;
};

// Componenta principală Modal
const Modal = ({ children, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => {
    setIsOpen(false);
    onClose?.();
  };

  const value = { isOpen, open, close };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
};

// Sub-componente
Modal.Trigger = ({ children }) => {
  const { open } = useModal();
  return React.cloneElement(children, { onClick: open });
};

Modal.Content = ({ children }) => {
  const { isOpen, close } = useModal();
  
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

Modal.Header = ({ children }) => (
  <div className="modal-header">{children}</div>
);

Modal.Body = ({ children }) => (
  <div className="modal-body">{children}</div>
);

Modal.Footer = ({ children }) => (
  <div className="modal-footer">{children}</div>
);

Modal.CloseButton = ({ children = "✕" }) => {
  const { close } = useModal();
  return (
    <button className="modal-close" onClick={close}>
      {children}
    </button>
  );
};

// Utilizare în CarList.jsx:
/*
<Modal onClose={() => setSelectedCar(null)}>
  <Modal.Trigger>
    <button className="btn btn-delete">🗑️ Șterge</button>
  </Modal.Trigger>
  
  <Modal.Content>
    <Modal.Header>
      <h2>Confirmare Ștergere</h2>
      <Modal.CloseButton />
    </Modal.Header>
    
    <Modal.Body>
      <p>Vrei să ștergi mașina {selectedCar?.brand} {selectedCar?.model}?</p>
    </Modal.Body>
    
    <Modal.Footer>
      <button onClick={() => deleteCar(selectedCar.id)}>Șterge</button>
      <Modal.CloseButton>
        <button>Anulează</button>
      </Modal.CloseButton>
    </Modal.Footer>
  </Modal.Content>
</Modal>
*/

export default Modal;
