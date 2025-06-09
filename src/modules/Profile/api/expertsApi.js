import { apiRequest } from "../../../utils/api";



export const getAvailableSlots = async () => {
  try {
    const response = await apiRequest({
      method: 'GET',
      url: '/api/my-available-slots',
    });
    return response.data; // Возвращает массив слотов
  } catch (error) {
    console.error('Ошибка при получении слотов:', error);
    throw error;
  }
};

// Создание новых свободных слотов
export const createAvailableSlots = async (date, times) => {
  try {
    const response = await apiRequest({
      method: 'POST',
      url: '/api/my-available-slots',
      data: {
        date: date, // Формат: "14.05.2025"
        time: times, // Массив времени, например: ["11:00", "12:00"]
      },
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при создании слотов:', error);
    throw error;
  }
};

// Удаление свободного слота
export const deleteAvailableSlot = async (slotId) => {
  try {
    const response = await apiRequest({
      method: 'DELETE',
      url: '/api/my-available-slots',
      data: {
        slot_id: slotId, // ID слота, например: 3
      },
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при удалении слота:', error);
    throw error;
  }
};