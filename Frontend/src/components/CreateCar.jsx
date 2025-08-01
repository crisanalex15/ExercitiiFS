import { useState, useEffect } from "react";
import { useEngines, useCreateCar, useUpdateCar } from "../hooks/useCars";

function CreateCar({ editingCar, onCarCreated, onCancel }) {
  const { data: engines = [], isLoading: enginesLoading } = useEngines();
  const createCarMutation = useCreateCar();
  const updateCarMutation = useUpdateCar();

  const [formData, setFormData] = useState({
    model: "",
    brand: "",
    year: "",
    color: "",
    fuelType: "",
    transmission: "",
    mileage: "",
    price: "",
    engineId: "",
  });

  // Populează formularul când editezi o mașină
  useEffect(() => {
    if (editingCar) {
      setFormData({
        model: editingCar.model || "",
        brand: editingCar.brand || "",
        year: editingCar.year || "",
        color: editingCar.color || "",
        fuelType: editingCar.fuelType || "",
        transmission: editingCar.transmission || "",
        mileage: editingCar.mileage || "",
        price: editingCar.price || "",
        engineId: editingCar.engineId ? editingCar.engineId.toString() : "",
      });
    }
  }, [editingCar]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convertește engineId la number
    const carData = {
      ...formData,
      engineId: parseInt(formData.engineId),
    };

    if (editingCar) {
      // Update existing car
      updateCarMutation.mutate(
        { id: editingCar.id, car: carData },
        {
          onSuccess: () => {
            if (onCarCreated) {
              onCarCreated();
            }
          },
          onError: (error) => {
            console.error("Eroare la actualizarea mașinii:", error);
          },
        }
      );
    } else {
      // Create new car
      createCarMutation.mutate(carData, {
        onSuccess: () => {
          // Reset form după succes doar când creezi
          setFormData({
            model: "",
            brand: "",
            year: "",
            color: "",
            fuelType: "",
            transmission: "",
            mileage: "",
            price: "",
            engineId: "",
          });

          if (onCarCreated) {
            onCarCreated();
          }
        },
        onError: (error) => {
          console.error("Eroare la crearea mașinii:", error);
        },
      });
    }
  };

  if (enginesLoading) {
    return <div>Se încarcă motoarele...</div>;
  }

  return (
    <div className="create-car-form">
      <div className="form">
        <h2>🚗 {editingCar ? "Editează Mașina" : "Creează Mașină Nouă"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="brand">🏢 Marca:</label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="ex: BMW, Mercedes, Audi"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="model">🚗 Model:</label>
              <input
                type="text"
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="ex: X5, E-Class, A4"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="year">📅 An:</label>
              <input
                type="text"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                placeholder="ex: 2023"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="color">🎨 Culoare:</label>
              <input
                type="text"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="ex: Negru, Alb, Roșu"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fuelType">⛽ Tip Combustibil:</label>
              <select
                id="fuelType"
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                required
              >
                <option value="">Selectează...</option>
                <option value="Benzină">Benzină</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hibrid">Hibrid</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="transmission">⚙️ Transmisie:</label>
              <select
                id="transmission"
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                required
              >
                <option value="">Selectează...</option>
                <option value="Manuală">Manuală</option>
                <option value="Automată">Automată</option>
                <option value="CVT">CVT</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="mileage">📏 Kilometraj:</label>
              <input
                type="text"
                id="mileage"
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                placeholder="ex: 50000 km"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">💰 Preț:</label>
              <input
                type="text"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="ex: 25000 EUR"
                required
              />
            </div>
          </div>

          {/* DROPDOWN PENTRU MOTOARE - PARTEA IMPORTANTĂ! */}
          <div className="form-group full-width">
            <label htmlFor="engineId">🔧 Selectează Motorul:</label>
            <select
              id="engineId"
              name="engineId"
              value={formData.engineId}
              onChange={handleChange}
              required
            >
              <option value="">Selectează un motor...</option>
              {engines.map((engine) => (
                <option key={engine.id} value={engine.id}>
                  {engine.brand} - {engine.fuelType} - {engine.power} -{" "}
                  {engine.displacement}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              disabled={
                createCarMutation.isPending || updateCarMutation.isPending
              }
              className="btn btn-primary"
            >
              {createCarMutation.isPending || updateCarMutation.isPending
                ? "Se salvează..."
                : editingCar
                ? "Actualizează Mașina"
                : "Creează Mașina"}
            </button>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="btn btn-secondary"
              >
                Anulează
              </button>
            )}
          </div>

          {/* AFIȘEAZĂ ERORI DACĂ SUNT */}
          {(createCarMutation.error || updateCarMutation.error) && (
            <div className="error-message">
              Eroare:{" "}
              {(createCarMutation.error || updateCarMutation.error)?.message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default CreateCar;
