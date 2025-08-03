import { useMotociclete, useDeleteMotocicleta } from "../hooks/UseMoto";
import MotorcycleForm from "./MotorcycleForm";
import { useState } from "react";
import "./style.scss";

const MotorcycleList = () => {
  const { data: motociclete, isLoading, error } = useMotociclete();
  const { mutate: deleteMotocicleta } = useDeleteMotocicleta();
  const [showCreateMotocicleta, setShowCreateMotocicleta] = useState(false);
  const [editingMotocicleta, setEditingMotocicleta] = useState(null);

  const editMotocicleta = (motocicleta) => {
    setEditingMotocicleta(motocicleta);
    setShowCreateMotocicleta(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Ești sigur că vrei să ștergi această motocicletă?")) {
      deleteMotocicleta(id);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h2 className="page-title">🏍️ Lista Motocicletelor</h2>
        <button
          onClick={() => setShowCreateMotocicleta(true)}
          className="btn btn-create"
        >
          + Adaugă Motocicletă
        </button>
      </div>

      {showCreateMotocicleta && (
        <div style={{ marginBottom: "var(--spacing-xl)" }}>
          <MotorcycleForm
            editingMotocicleta={editingMotocicleta}
            onSave={() => {
              setShowCreateMotocicleta(false);
              setEditingMotocicleta(null);
            }}
            onCancel={() => {
              setShowCreateMotocicleta(false);
              setEditingMotocicleta(null);
            }}
          />
        </div>
      )}

      {motociclete && motociclete.length === 0 ? (
        <div className="card">
          <div className="card-content">
            <p className="empty-message">
              Nu există motociclete în baza de date.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-auto">
          {motociclete.map((motocicleta) => (
            <div key={motocicleta.id} className="card">
              <div className="card-header">
                <h3>
                  🏍️ {motocicleta.Brand || motocicleta.brand}{" "}
                  {motocicleta.Model || motocicleta.model}
                </h3>
                <div className="card-actions">
                  <button
                    onClick={() => editMotocicleta(motocicleta)}
                    className="btn btn-edit"
                  >
                    ✏️ Editează
                  </button>
                  <button
                    onClick={() => handleDelete(motocicleta.id)}
                    className="btn btn-delete"
                  >
                    🗑️ Șterge
                  </button>
                </div>
              </div>

              <div className="card-content">
                <div className="car-details">
                  <div className="detail-row">
                    <span className="detail-label">📅 An:</span>
                    <span className="detail-value">
                      {motocicleta.Year || motocicleta.year}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">🎨 Culoare:</span>
                    <span className="detail-value">
                      {motocicleta.Color || motocicleta.color}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">⚙️ Transmisie:</span>
                    <span className="detail-value">
                      {motocicleta.Transmission || motocicleta.transmission}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">📏 Kilometraj:</span>
                    <span className="detail-value">
                      {motocicleta.Mileage || motocicleta.mileage}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">💰 Preț:</span>
                    <span className="detail-value">
                      {motocicleta.Price || motocicleta.price}
                    </span>
                  </div>

                  {motocicleta.engine && (
                    <div className="engine-info">
                      <h4>🔧 Informații Motor:</h4>
                      <div className="detail-row">
                        <span className="detail-label">Marcă:</span>
                        <span className="detail-value">
                          {motocicleta.engine?.Brand ||
                            motocicleta.engine?.brand}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Cilindree:</span>
                        <span className="detail-value">
                          {motocicleta.engine?.Displacement ||
                            motocicleta.engine?.displacement}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Putere:</span>
                        <span className="detail-value">
                          {motocicleta.engine?.Power ||
                            motocicleta.engine?.power}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Cuplu:</span>
                        <span className="detail-value">
                          {motocicleta.engine?.Torque ||
                            motocicleta.engine?.torque}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Combustibil:</span>
                        <span className="detail-value">
                          {motocicleta.engine?.FuelType ||
                            motocicleta.engine?.fuelType}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MotorcycleList;
