import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  getEngines,
  createEngine,
  updateEngine,
  deleteEngine,
  getCars,
  createCar,
  updateCar,
  deleteCar,
} from "../utils/api";

// Hook pentru obținerea motoarelor
export const useEngines = () => {
  return useQuery({
    queryKey: ["engines"],
    queryFn: getEngines,
    staleTime: 5 * 60 * 1000, // 5 minute
    cacheTime: 10 * 60 * 1000, // 10 minute
  });
};

// Hook pentru obținerea mașinilor
export const useCars = () => {
  return useInfiniteQuery({
    queryKey: ["cars"],
    queryFn: ({ pageParam = 1 }) => getCars(pageParam, 6),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    getPreviousPageParam: (firstPage) => firstPage.prevPage,
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minute
    cacheTime: 10 * 60 * 1000, // 10 minute
  });
};

// Hook pentru crearea unui motor nou
export const useCreateEngine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEngine,
    onSuccess: () => {
      // Invalidează cache-ul pentru engines după crearea cu succes
      queryClient.invalidateQueries({ queryKey: ["engines"] });
    },
    onError: (error) => {
      console.error("Eroare la crearea motorului:", error);
    },
  });
};

// Hook pentru crearea unei mașini noi
export const useCreateCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCar,
    onSuccess: () => {
      // Invalidează cache-ul pentru cars după crearea cu succes
      queryClient.invalidateQueries({ queryKey: ["cars"] });
    },
    onError: (error) => {
      console.error("Eroare la crearea mașinii:", error);
    },
  });
};

// Hook pentru actualizarea unui motor
export const useUpdateEngine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, engine }) => updateEngine(id, engine),
    onSuccess: () => {
      // Invalidează cache-ul pentru engines după actualizarea cu succes
      queryClient.invalidateQueries({ queryKey: ["engines"] });
    },
    onError: (error) => {
      console.error("Eroare la actualizarea motorului:", error);
    },
  });
};

// Hook pentru ștergerea unui motor
export const useDeleteEngine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEngine,
    onSuccess: () => {
      // Invalidează cache-ul pentru engines după ștergerea cu succes
      queryClient.invalidateQueries({ queryKey: ["engines"] });
    },
    onError: (error) => {
      console.error("Eroare la ștergerea motorului:", error);
    },
  });
};

// Hook pentru actualizarea unei mașini
export const useUpdateCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, car }) => updateCar(id, car),
    onSuccess: () => {
      // Invalidează cache-ul pentru cars după actualizarea cu succes
      queryClient.invalidateQueries({ queryKey: ["cars"] });
    },
    onError: (error) => {
      console.error("Eroare la actualizarea mașinii:", error);
    },
  });
};

// Hook pentru ștergerea unei mașini
export const useDeleteCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCar,
    onSuccess: () => {
      // Invalidează cache-ul pentru cars după ștergerea cu succes
      queryClient.invalidateQueries({ queryKey: ["cars"] });
    },
    onError: (error) => {
      console.error("Eroare la ștergerea mașinii:", error);
    },
  });
};
