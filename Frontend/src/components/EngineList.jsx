import { useState, useMemo } from "react";
import { useEngines, useDeleteEngine } from "../hooks/useCars";
import EngineForm from "./EngineForm";
import "./style.scss";

function EngineList({ onEdit }) {
  const { data: engines, isLoading, error } = useEngines();
  const { mutate: deleteEngine } = useDeleteEngine();
  const [editingEngine, setEditingEngine] = useState(null);
  const [showCreateEngine, setShowCreateEngine] = useState(false);
  const [filterBy, setFilterBy] = useState("");

  const editEngine = (engine) => {
    setEditingEngine(engine);
    setShowCreateEngine(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Ești sigur că vrei să ștergi acest motor?")) {
      deleteEngine(id);
    }
  };

  const filteredEngines = useMemo(() => {
    if (!engines) return [];
    let filtered = engines.filter((engine) => {
      if (!filterBy) return true;
      return (
        engine.brand.toLowerCase().includes(filterBy.toLowerCase()) ||
        engine.fuelType.toLowerCase().includes(filterBy.toLowerCase()) ||
        engine.power.toLowerCase().includes(filterBy.toLowerCase()) ||
        engine.torque.toLowerCase().includes(filterBy.toLowerCase()) ||
        engine.displacement.toLowerCase().includes(filterBy.toLowerCase())
      );
    });
    return filtered;
  }, [engines, filterBy]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h2 className="page-title">🔧 Lista Motoarelor</h2>
        <input
          type="text"
          placeholder="🔍 Caută după marcă, combustibil, putere..."
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          className="search-input"
        />
        <button
          onClick={() => setShowCreateEngine(true)}
          className="btn btn-create"
        >
          + Adaugă Motor
        </button>
      </div>

      {showCreateEngine && (
        <div style={{ marginBottom: "var(--spacing-xl)" }}>
          <EngineForm
            editingEngine={editingEngine}
            onSave={() => {
              setShowCreateEngine(false);
              setEditingEngine(null);
            }}
            onCancel={() => {
              setShowCreateEngine(false);
              setEditingEngine(null);
            }}
          />
        </div>
      )}

      {filteredEngines.length === 0 ? (
        <div className="card">
          <div className="card-content">
            <p className="empty-message">
              {filterBy
                ? `Nu s-au găsit motoare care să conțină "${filterBy}".`
                : "Nu există motoare în baza de date."}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-auto">
          {filteredEngines.map((engine) => (
            <div key={engine.id} className="card">
              <div className="card-header">
                <h3>🔧 {engine.Brand || engine.brand}</h3>
                <div className="card-actions">
                  <button
                    onClick={() => editEngine(engine)}
                    className="btn btn-edit"
                  >
                    ✏️ Editează
                  </button>
                  <button
                    onClick={() => handleDelete(engine.id)}
                    className="btn btn-delete"
                  >
                    🗑️ Șterge
                  </button>
                </div>
              </div>

              <div className="card-content">
                <div className="car-details">
                  <div className="detail-row">
                    <span className="detail-label">⛽ Combustibil:</span>
                    <span className="detail-value">
                      {engine.FuelType || engine.fuelType}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">⚡ Putere:</span>
                    <span className="detail-value">
                      {engine.Power || engine.power}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">🔩 Cuplu:</span>
                    <span className="detail-value">
                      {engine.Torque || engine.torque}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">
                      🔧 Capacitate Cilindrică:
                    </span>
                    <span className="detail-value">
                      {engine.Displacement || engine.displacement}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EngineList;
