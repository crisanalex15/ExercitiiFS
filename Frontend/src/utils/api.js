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

const getCars = async (page = 1, pageSize = 6) => {
  try {
    console.log(`Fetching cars: page=${page}, pageSize=${pageSize}`);

    const response = await fetch(
      `${API_URL}/cars?page=${page}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `API Error: ${response.status} ${response.statusText}`,
        errorText
      );
      throw new Error(
        `Failed to fetch cars: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log(`Received ${data.length} cars for page ${page}`);

    // Verificăm dacă data este array
    if (!Array.isArray(data)) {
      console.error("API response is not an array:", data);
      throw new Error("Invalid API response format");
    }

    // Calculăm dacă mai sunt pagini următoare
    const hasMore = data.length === pageSize;

    return {
      data, // array cu mașinile din pagina curentă
      nextPage: hasMore ? page + 1 : undefined,
      prevPage: page > 1 ? page - 1 : undefined,
    };
  } catch (error) {
    console.error("Error in getCars:", error);
    throw error;
  }
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
