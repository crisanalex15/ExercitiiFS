import { useCars, useDeleteCar } from "../hooks/useCars";
import CreateCar from "./CreateCar";
import { useState, useMemo, useEffect } from "react";
import "./style.scss";

const CarList = () => {
  const { data: cars, isLoading, error } = useCars();
  const { mutate: deleteCar } = useDeleteCar();
  const [showCreateCar, setShowCreateCar] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [sortBy, setSortBy] = useState("default"); // default, year, brand, price
  const [sortOrder, setSortOrder] = useState("asc"); // asc, desc
  const [filterBy, setFilterBy] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  // IMPORTANT: Toate hook-urile trebuie să fie apelate înainte de orice early return
  // Filtrare și sortare cu useMemo pentru performanță
  const filteredAndSortedCars = useMemo(() => {
    if (!cars) return [];

    // Aplicăm filtrarea
    let filtered = cars.filter((car) => {
      if (!filterBy) return true;
      return (
        car.brand.toLowerCase().includes(filterBy.toLowerCase()) ||
        car.model.toLowerCase().includes(filterBy.toLowerCase()) ||
        car.color.toLowerCase().includes(filterBy.toLowerCase()) ||
        car.transmission.toLowerCase().includes(filterBy.toLowerCase())
      );
    });

    // Aplicăm sortarea
    if (sortBy === "year") {
      filtered.sort((a, b) =>
        sortOrder === "asc" ? a.year - b.year : b.year - a.year
      );
    } else if (sortBy === "brand") {
      filtered.sort((a, b) =>
        sortOrder === "asc"
          ? a.brand.localeCompare(b.brand)
          : b.brand.localeCompare(a.brand)
      );
    } else if (sortBy === "price") {
      filtered.sort((a, b) =>
        sortOrder === "asc" ? a.price - b.price : b.price - a.price
      );
    }

    return filtered;
  }, [cars, sortBy, sortOrder, filterBy]);

  // ESC key support pentru închiderea modalului
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape" && showDeleteModal) {
        setShowDeleteModal(false);
      }
    };

    // Adăugăm event listener doar când modalul este deschis
    if (showDeleteModal) {
      document.addEventListener("keydown", handleEscKey);
    }

    // Cleanup function
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [showDeleteModal]);

  // Early returns DUPĂ toate hook-urile
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleSort = (criteria) => {
    if (sortBy === criteria) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(criteria);
      setSortOrder("asc");
    }
  };

  return (
    <>
      <div
        className="delete-modal"
        style={{ visibility: showDeleteModal ? "visible" : "hidden" }}
        onClick={() => setShowDeleteModal(false)}
      >
        <div
          className="delete-modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <h2>
            Ștergere Mașină {selectedCar?.brand} {selectedCar?.model}
          </h2>
          <p>Vrei să ștergi această mașină?</p>
          <button
            className="deleteButton"
            onClick={() => deleteCar(selectedCar.id)}
          >
            Șterge
          </button>
          <button
            className="cancelButton"
            onClick={() => setShowDeleteModal(false)}
          >
            Renunță
          </button>
        </div>
      </div>

      <div className="container">
        <div className="page-header">
          <h2 className="page-title">🚗 Lista Mașinilor</h2>

          {/* Control pentru filtrare */}
          <input
            type="text"
            placeholder="🔍 Caută după marcă, model, culoare..."
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="search-input"
            style={{
              padding: "8px 12px",
              borderRadius: "4px",
              border: "1px solid #ddd",
              marginRight: "10px",
              minWidth: "250px",
            }}
          />

          {/* Butoane pentru sortare */}
          <button
            className={`btn ${
              sortBy === "year" ? "btn-active" : "btn-secondary"
            }`}
            onClick={() => handleSort("year")}
          >
            📅 An {sortBy === "year" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>

          <button
            className={`btn ${
              sortBy === "brand" ? "btn-active" : "btn-secondary"
            }`}
            onClick={() => handleSort("brand")}
          >
            🏢 Marcă {sortBy === "brand" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>

          <button
            className={`btn ${
              sortBy === "price" ? "btn-active" : "btn-secondary"
            }`}
            onClick={() => handleSort("price")}
          >
            💰 Preț {sortBy === "price" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>

          <button
            onClick={() => setShowCreateCar(true)}
            className="btn btn-create"
          >
            + Adaugă Mașină
          </button>
        </div>

        {/* Afișăm numărul de rezultate */}
        {cars && cars.length > 0 && (
          <div style={{ margin: "16px 0", color: "#666", fontSize: "14px" }}>
            {filterBy
              ? `Găsite ${filteredAndSortedCars.length} mașini din ${cars.length} pentru "${filterBy}"`
              : `Total: ${filteredAndSortedCars.length} mașini${
                  sortBy !== "default" ? ` (sortate după ${sortBy})` : ""
                }`}
          </div>
        )}

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

        {filteredAndSortedCars.length === 0 ? (
          <div className="card">
            <div className="card-content">
              <p className="empty-message">
                {filterBy
                  ? `Nu s-au găsit mașini care să conțină "${filterBy}".`
                  : "Nu există mașini în baza de date."}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-auto">
            {filteredAndSortedCars.map((car) => (
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
                      onClick={() => {
                        setSelectedCar(car);
                        setShowDeleteModal(true);
                      }}
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
                        <span className="detail-value">
                          {car.engine.torque}
                        </span>
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
    </>
  );
};

export default CarList;
