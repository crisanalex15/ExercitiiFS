import { useCars, useDeleteCar } from "../hooks/useCars";
import CreateCar from "./CreateCar";
import { useState } from "react";

const CarList = () => {
  const { data: cars, isLoading, error } = useCars();
  const { mutate: deleteCar } = useDeleteCar();
  const [showCreateCar, setShowCreateCar] = useState(false);
  const [editingCar, setEditingCar] = useState(null);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h2 className="page-title">🚗 Lista Mașinilor</h2>
        <button
          onClick={() => setShowCreateCar(true)}
          className="btn btn-create"
        >
          + Adaugă Mașină
        </button>
      </div>

      {showCreateCar && (
        <div style={{ marginBottom: "var(--spacing-xl)" }}>
          <CreateCar
            editingCar={editingCar}
            onCarCreated={() => {
              setShowCreateCar(false);
              setEditingCar(null);
            }}
            onCancel={() => {
              setShowCreateCar(false);
              setEditingCar(null);
            }}
          />
        </div>
      )}

      {cars && cars.length === 0 ? (
        <div className="card">
          <div className="card-content">
            <p className="empty-message">Nu există mașini în baza de date.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-auto">
          {cars.map((car) => (
            <div key={car.id} className="card">
              <div className="card-header">
                <h3>
                  🚗 {car.brand} {car.model}
                </h3>
                <div className="card-actions">
                  <button
                    onClick={() => {
                      setShowCreateCar(true);
                      setEditingCar(car);
                    }}
                    className="btn btn-edit"
                  >
                    ✏️ Editează
                  </button>
                  <button
                    onClick={() => deleteCar(car.id)}
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
                    <span className="detail-value">{car.year}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">🎨 Culoare:</span>
                    <span className="detail-value">{car.color}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">⚙️ Transmisie:</span>
                    <span className="detail-value">{car.transmission}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">📏 Kilometraj:</span>
                    <span className="detail-value">{car.mileage}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">💰 Preț:</span>
                    <span className="detail-value">{car.price}</span>
                  </div>

                  <div className="engine-info">
                    <h4>🔧 Informații Motor:</h4>
                    <div className="detail-row">
                      <span className="detail-label">Marcă:</span>
                      <span className="detail-value">{car.engine.brand}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Cilindree:</span>
                      <span className="detail-value">
                        {car.engine.displacement}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Putere:</span>
                      <span className="detail-value">{car.engine.power}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Cuplu:</span>
                      <span className="detail-value">{car.engine.torque}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Combustibil:</span>
                      <span className="detail-value">
                        {car.engine.fuelType}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CarList;
