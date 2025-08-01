import { useState, useEffect } from "react";
import { useCreateEngine, useUpdateEngine } from "../hooks/useCars";

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
      updateEngine.mutate({ id: editingEngine.id, engine: formData });
    } else {
      createEngine.mutate(formData);
    }
    setFormData({
      brand: "",
      fuelType: "",
      power: "",
      torque: "",
      displacement: "",
    });
    onCancel();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loading = createEngine.isLoading || updateEngine.isLoading;
  const error = createEngine.error || updateEngine.error;

  return (
    <div className="engine-form">
      <h2>{editingEngine ? "Editează Motor" : "Adaugă Motor"}</h2>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Brand</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Combustibil</label>
          <input
            type="text"
            name="fuelType"
            value={formData.fuelType}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Putere</label>
          <input
            type="number"
            name="power"
            value={formData.power}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Cuplu</label>
          <input
            type="number"
            name="torque"
            value={formData.torque}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Capacitate</label>
          <input
            type="number"
            name="displacement"
            value={formData.displacement}
            onChange={handleChange}
          />
        </div>
        <button type="submit" disabled={loading}>
          {editingEngine ? "Salvează" : "Adaugă"}
        </button>
        <button type="button" onClick={onCancel}>
          Anulează
        </button>
      </form>
    </div>
  );
}
export default EngineForm;
