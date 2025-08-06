import { useCars, useDeleteCar } from "../hooks/useCars";
import CreateCar from "./CreateCar";
import { useState, useMemo, useEffect, useRef } from "react";
import { useDebounce } from "../hooks/useAdvancedHooks";
import "./style.scss";

const CarList = () => {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCars();

  // Flatten all pages data into a single array
  const cars = data?.pages.flatMap((page) => page.data) || [];

  // Ref pentru intersection observer
  const loaderRef = useRef(null);

  const { mutate: deleteCar } = useDeleteCar();
  const [showCreateCar, setShowCreateCar] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [sortBy, setSortBy] = useState("default"); // default, year, brand, price
  const [sortOrder, setSortOrder] = useState("asc"); // asc, desc
  const [filterBy, setFilterBy] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  // Debounced search pentru optimizarea performanței
  const debouncedFilter = useDebounce(filterBy, 300);

  // IMPORTANT: Toate hook-urile trebuie să fie apelate înainte de orice early return
  // Filtrare și sortare cu useMemo pentru performanță
  const filteredAndSortedCars = useMemo(() => {
    if (!cars) return [];

    // Aplicăm filtrarea cu debounced value
    let filtered = cars.filter((car) => {
      if (!debouncedFilter) return true;
      return (
        car.brand.toLowerCase().includes(debouncedFilter.toLowerCase()) ||
        car.model.toLowerCase().includes(debouncedFilter.toLowerCase()) ||
        car.color.toLowerCase().includes(debouncedFilter.toLowerCase()) ||
        car.transmission.toLowerCase().includes(debouncedFilter.toLowerCase())
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
  }, [cars, sortBy, sortOrder, debouncedFilter]);

  // Intersection Observer pentru infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: "20px",
        threshold: 0.1,
      }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

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
    return (
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "200px",
        }}
      >
        <div style={{ textAlign: "center" }}>🔄 Se încarcă mașinile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="card" style={{ margin: "20px 0" }}>
          <div
            className="card-content"
            style={{
              padding: "20px",
              textAlign: "center",
              color: "#dc3545",
            }}
          >
            <h3>❌ Eroare la încărcarea mașinilor</h3>
            <p>
              <strong>Detalii:</strong> {error.message}
            </p>
            <details style={{ marginTop: "10px" }}>
              <summary style={{ cursor: "pointer", color: "#6c757d" }}>
                Informații pentru debugging
              </summary>
              <div
                style={{
                  marginTop: "10px",
                  padding: "10px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontFamily: "monospace",
                }}
              >
                <p>
                  <strong>URL API:</strong>{" "}
                  http://localhost:5086/api/car-engine/cars
                </p>
                <p>
                  <strong>Verifică:</strong>
                </p>
                <ul style={{ textAlign: "left", margin: "10px 0" }}>
                  <li>Backend-ul rulează pe portul 5086?</li>
                  <li>CORS este configurat corect?</li>
                  <li>Există mașini în baza de date?</li>
                </ul>
              </div>
            </details>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-secondary"
              style={{ marginTop: "15px" }}
            >
              🔄 Reîncarcă pagina
            </button>
          </div>
        </div>
      </div>
    );
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
            {debouncedFilter
              ? `Găsite ${filteredAndSortedCars.length} mașini din ${cars.length} pentru "${debouncedFilter}"`
              : `Total: ${filteredAndSortedCars.length} mașini încărcate din ${
                  data?.pages.length || 0
                } pagini${
                  sortBy !== "default" ? ` (sortate după ${sortBy})` : ""
                } • 6 pe pagină`}
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
                {debouncedFilter
                  ? `Nu s-au găsit mașini care să conțină "${debouncedFilter}".`
                  : "Nu există mașini în baza de date."}
              </p>
            </div>
          </div>
        ) : (
          <>
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
                          <span className="detail-value">
                            {car.engine.brand}
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Cilindree:</span>
                          <span className="detail-value">
                            {car.engine.displacement}
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Putere:</span>
                          <span className="detail-value">
                            {car.engine.power}
                          </span>
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

            {/* Loader element pentru infinite scroll */}
            <div
              ref={loaderRef}
              style={{
                minHeight: "60px",
                margin: "30px 0",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "8px",
                backgroundColor: isFetchingNextPage ? "#f8f9fa" : "transparent",
              }}
            >
              {isFetchingNextPage && (
                <div
                  className="card"
                  style={{
                    padding: "20px 30px",
                    textAlign: "center",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    animation: "pulse 2s infinite",
                  }}
                >
                  <div style={{ fontSize: "18px", marginBottom: "8px" }}>
                    🔄 Se încarcă mai multe mașini...
                  </div>
                  <div style={{ fontSize: "12px", opacity: 0.8 }}>
                    Pagina {data ? data.pages.length + 1 : 1} • 6 mașini pe
                    pagină
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CarList;
