import { useMotociclete, useDeleteMotocicleta } from "../hooks/UseMoto";
import MotorcycleForm from "./MotorcycleForm";
import { useState, useMemo, useEffect } from "react";
import "./style.scss";

const MotorcycleList = () => {
  const { data: motociclete, isLoading, error } = useMotociclete();
  const { mutate: deleteMotocicleta } = useDeleteMotocicleta();
  const [showCreateMotocicleta, setShowCreateMotocicleta] = useState(false);
  const [editingMotocicleta, setEditingMotocicleta] = useState(null);
  const [sortBy, setSortBy] = useState("default"); // default, year, brand, price
  const [sortOrder, setSortOrder] = useState("asc"); // asc, desc
  const [filterBy, setFilterBy] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMotocicleta, setSelectedMotocicleta] = useState(null);

  const editMotocicleta = (motocicleta) => {
    setEditingMotocicleta(motocicleta);
    setShowCreateMotocicleta(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Ești sigur că vrei să ștergi această motocicletă?")) {
      deleteMotocicleta(id);
    }
  };

  const filteredAndSortedMotociclete = useMemo(() => {
    if (!motociclete) return [];

    let filtered = motociclete.filter((motocicleta) => {
      if (!filterBy) return true;
      return (
        motocicleta.brand.toLowerCase().includes(filterBy.toLowerCase()) ||
        motocicleta.model.toLowerCase().includes(filterBy.toLowerCase()) ||
        motocicleta.color.toLowerCase().includes(filterBy.toLowerCase()) ||
        motocicleta.transmission.toLowerCase().includes(filterBy.toLowerCase())
      );
    });
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
  }, [motociclete, sortBy, sortOrder, filterBy]);

  const handleSort = (criteria) => {
    if (sortBy === criteria) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(criteria);
      setSortOrder("asc");
    }
  };

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <div className="container">
        <div className="page-header">
          <h2 className="page-title">🏍️ Lista Motocicletelor</h2>
          <input
            type="text"
            placeholder="🔍 Caută după marcă, model, culoare..."
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="search-input"
          />
          <div className="motoSortFilter">
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
              onClick={() => setShowCreateMotocicleta(true)}
              className="btn btn-create"
            >
              + Adaugă Motocicletă
            </button>
          </div>
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

        {filteredAndSortedMotociclete.length === 0 ? (
          <div className="card">
            <div className="card-content">
              <p className="empty-message">
                {filterBy
                  ? `Nu s-au găsit motociclete care să conțină "${filterBy}".`
                  : "Nu există motociclete în baza de date."}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-auto">
            {filteredAndSortedMotociclete.map((motocicleta) => (
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
                      onClick={() => {
                        setSelectedMotocicleta(motocicleta);
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
            Ștergere Motocicletă{" "}
            {selectedMotocicleta?.Brand || selectedMotocicleta?.brand}{" "}
            {selectedMotocicleta?.Model || selectedMotocicleta?.model}
          </h2>
          <p>Vrei să ștergi această motocicletă?</p>
          <button
            className="deleteButton"
            onClick={() => deleteMotocicleta(selectedMotocicleta.id)}
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
    </>
  );
};

export default MotorcycleList;
