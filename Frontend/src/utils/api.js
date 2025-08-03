// API utility functions

const API_URL = "http://localhost:5086/api/car-engine";

const getEngines = async () => {
  const response = await fetch(`${API_URL}/engines`);
  if (!response.ok) {
    throw new Error("Failed to fetch engines");
  }
  const data = await response.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return data;
};

const createEngine = async (engine) => {
  const response = await fetch(`${API_URL}/engines`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(engine),
  });
  const data = await response.json();
  return data;
};

const getCars = async () => {
  const response = await fetch(`${API_URL}/cars`);
  const data = await response.json();
  return data;
};

const createCar = async (car) => {
  const response = await fetch(`${API_URL}/cars`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(car),
  });
  const data = await response.json();
  return data;
};

const updateEngine = async (id, engine) => {
  const response = await fetch(`${API_URL}/engines/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(engine),
  });
  if (!response.ok) {
    throw new Error("Failed to update engine");
  }
  const data = await response.json();
  return data;
};

const deleteEngine = async (id) => {
  const response = await fetch(`${API_URL}/engines/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete engine");
  }
  return { success: true };
};

const updateCar = async (id, car) => {
  const response = await fetch(`${API_URL}/cars/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(car),
  });
  if (!response.ok) {
    throw new Error("Failed to update car");
  }
  const data = await response.json();
  return data;
};

const deleteCar = async (id) => {
  const response = await fetch(`${API_URL}/cars/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete car");
  }
  return { success: true };
};

const URL_MOTO = "http://localhost:5086/api/motorcycle";

const getMotociclete = async () => {
  const response = await fetch(`${URL_MOTO}/motociclete`);
  if (!response.ok) {
    throw new Error("Failed to fetch motociclete");
  }
  const data = await response.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return data;
};

const createMotocicleta = async (motocicleta) => {
  const response = await fetch(`${URL_MOTO}/motociclete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(motocicleta),
  });
  const data = await response.json();
  return data;
};

const updateMotocicleta = async (id, motocicleta) => {
  const response = await fetch(`${URL_MOTO}/motociclete/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(motocicleta),
  });
  if (!response.ok) {
    throw new Error("Failed to update motocicleta");
  }
  const data = await response.json();
  return data;
};

const deleteMotocicleta = async (id) => {
  const response = await fetch(`${URL_MOTO}/motociclete/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete motocicleta");
  }
  return { success: true };
};
// Export all API functions
export {
  getEngines,
  createEngine,
  updateEngine,
  deleteEngine,
  getCars,
  createCar,
  updateCar,
  deleteCar,
  getMotociclete,
  createMotocicleta,
  updateMotocicleta,
  deleteMotocicleta,
};
