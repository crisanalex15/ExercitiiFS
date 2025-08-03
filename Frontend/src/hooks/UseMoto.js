import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMotociclete,
  createMotocicleta,
  updateMotocicleta,
  deleteMotocicleta,
} from "../utils/api";

export const useMotociclete = () => {
  return useQuery({
    queryKey: ["motociclete"],
    queryFn: getMotociclete,
    staleTime: 5 * 60 * 1000, // 5 minute
    cacheTime: 10 * 60 * 1000, // 10 minute
  });
};

export const useCreateMotocicleta = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMotocicleta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["motociclete"] });
    },
    onError: (error) => {
      console.error("Eroare la crearea motocicletei:", error);
    },
  });
};

export const useUpdateMotocicleta = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, motocicleta }) => updateMotocicleta(id, motocicleta),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["motociclete"] });
    },
    onError: (error) => {
      console.error("Eroare la actualizarea motocicletei:", error);
    },
  });
};

export const useDeleteMotocicleta = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMotocicleta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["motociclete"] });
    },
    onError: (error) => {
      console.error("Eroare la ștergerea motocicletei:", error);
    },
  });
};
