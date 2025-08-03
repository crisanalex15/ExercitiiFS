import { useState, useEffect } from "react";
import { useCreateEngine, useUpdateEngine } from "../hooks/useCars";
import "./style.scss";

function EngineForm({ editingEngine, onSave, onCancel }) {
  const createEngine = useCreateEngine();
  const updateEngine = useUpdateEngine();

  const [formData, setFormData] = useState({
    brand: "",
    fuelType: "",
    power: "",
    torque: "",
    displacement: "",
  });

  useEffect(() => {
    if (editingEngine) {
      setFormData(editingEngine);
    }
  }, [editingEngine]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingEngine) {
      updateEngine.mutate(
        { id: editingEngine.id, engine: formData },
        {
          onSuccess: () => {
            if (onSave) onSave();
            if (onCancel) onCancel();
          },
        }
      );
    } else {
      createEngine.mutate(formData, {
        onSuccess: () => {
          setFormData({
            brand: "",
            fuelType: "",
            power: "",
            torque: "",
            displacement: "",
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

  const loading = createEngine.isPending || updateEngine.isPending;
  const error = createEngine.error || updateEngine.error;

  return (
    <div className="create-car-form">
      <div className="form">
        <h2>🔧 {editingEngine ? "Editează Motorul" : "Creează Motor Nou"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="brand">🏢 Marca Motorului:</label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="ex: BMW, Mercedes, Honda"
                required
              />
            </div>

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
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="power">⚡ Putere (HP):</label>
              <input
                type="text"
                id="power"
                name="power"
                value={formData.power}
                onChange={handleChange}
                placeholder="ex: 300 HP"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="torque">🔩 Cuplu (Nm):</label>
              <input
                type="text"
                id="torque"
                name="torque"
                value={formData.torque}
                onChange={handleChange}
                placeholder="ex: 450 Nm"
                required
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="displacement">🔧 Capacitate Cilindrică:</label>
            <input
              type="text"
              id="displacement"
              name="displacement"
              value={formData.displacement}
              onChange={handleChange}
              placeholder="ex: 2.0L, 3000cc"
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading
                ? "Se salvează..."
                : editingEngine
                ? "Actualizează Motorul"
                : "Creează Motorul"}
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
export default EngineForm;
