import { useState, useEffect } from "react";
import { useEngines, useDeleteEngine } from "../hooks/useCars";
import EngineForm from "./EngineForm";

function EngineList({ onEdit }) {
  const { data: engines, isLoading, error } = useEngines();
  const { mutate: deleteEngine } = useDeleteEngine();
  const [editingEngine, setEditingEngine] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm("Ești sigur că vrei să ștergi acest motor?")) {
      try {
        await deleteEngine(id);
      } catch (error) {
        console.error("Eroare la ștergerea motorului:", error);
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="engine-list">
      <h2>Lista Motoarelor</h2>
      {engines && engines.length === 0 ? (
        <p className="empty-message">Nu există motoare în baza de date.</p>
      ) : (
        <div className="engines-grid">
          {engines.map((engine) => (
            <div key={engine.id} className="engine-card">
              <div className="engine-header">
                <h3>{engine.brand}</h3>
                <div className="engine-actions">
                  <button
                    onClick={() => setEditingEngine(engine)}
                    className="btn btn-edit"
                  >
                    Editează
                  </button>
                  <button
                    onClick={() => handleDelete(engine.id)}
                    className="btn btn-delete"
                  >
                    Șterge
                  </button>
                </div>
              </div>

              <div className="engine-details">
                <p>
                  <strong>Combustibil:</strong> {engine.fuelType}
                </p>
                <p>
                  <strong>Putere:</strong> {engine.power}
                </p>
                <p>
                  <strong>Cuplu:</strong> {engine.torque}
                </p>
                <p>
                  <strong>Capacitate:</strong> {engine.displacement}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      {editingEngine && (
        <EngineForm
          editingEngine={editingEngine}
          onSave={() => setEditingEngine(false)}
          onCancel={() => setEditingEngine(false)}
        />
      )}
    </div>
  );
}

export default EngineList;
