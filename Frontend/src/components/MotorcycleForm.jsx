import { useState, useEffect } from "react";
import { useEngines } from "../hooks/useCars";
import { useCreateMotocicleta, useUpdateMotocicleta } from "../hooks/UseMoto";
import "./style.scss";

function MotorcycleForm({ editingMotocicleta, onSave, onCancel }) {
  const { data: engines = [], isLoading: enginesLoading } = useEngines();
  const createMotocicleta = useCreateMotocicleta();
  const updateMotocicleta = useUpdateMotocicleta();

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    color: "",
    fuelType: "",
    transmission: "",
    mileage: "",
    price: "",
    engineId: "",
  });

  useEffect(() => {
    if (editingMotocicleta) {
      setFormData(editingMotocicleta);
    }
  }, [editingMotocicleta]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convertește engineId la number
    const motocicletaData = {
      ...formData,
      engineId: parseInt(formData.engineId),
    };

    if (editingMotocicleta) {
      updateMotocicleta.mutate(
        {
          id: editingMotocicleta.id,
          motocicleta: motocicletaData,
        },
        {
          onSuccess: () => {
            if (onSave) onSave();
            if (onCancel) onCancel();
          },
        }
      );
    } else {
      createMotocicleta.mutate(motocicletaData, {
        onSuccess: () => {
          setFormData({
            brand: "",
            model: "",
            year: "",
            color: "",
            fuelType: "",
            transmission: "",
            mileage: "",
            price: "",
            engineId: "",
          });
          if (onSave) onSave();
          if (onCancel) onCancel();
        },
      });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loading = createMotocicleta.isPending || updateMotocicleta.isPending;
  const error = createMotocicleta.error || updateMotocicleta.error;

  if (enginesLoading) {
    return <div>Se încarcă motoarele...</div>;
  }

  return (
    <div className="create-car-form">
      <div className="form">
        <h2>
          🏍️{" "}
          {editingMotocicleta
            ? "Editează Motocicleta"
            : "Creează Motocicletă Nouă"}
        </h2>

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
                placeholder="ex: Honda, Yamaha, Ducati"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="model">🏍️ Model:</label>
              <input
                type="text"
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="ex: CBR1000RR, MT-09, Panigale"
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
                placeholder="ex: Negru, Roșu, Albastru"
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
                placeholder="ex: 25000 km"
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
                placeholder="ex: 15000 EUR"
                required
              />
            </div>
          </div>

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
              disabled={loading}
              className="btn btn-primary"
            >
              {loading
                ? "Se salvează..."
                : editingMotocicleta
                ? "Actualizează Motocicleta"
                : "Creează Motocicleta"}
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

          {error && (
            <div className="error-message">Eroare: {error?.message}</div>
          )}
        </form>
      </div>
    </div>
  );
}

export default MotorcycleForm;
