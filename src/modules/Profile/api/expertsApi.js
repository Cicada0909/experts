import { apiRequest } from "../../../utils/api.js";

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


export const getExpert = async () => {
  const response = await apiRequest({
    url: '/api/experts/me',
    method: 'GET',
  })
  return response.data
}

export const getMyServices = async () => {
  const response = await apiRequest({
    url: '/api/get-my-services',
    method: 'GET',
  })
  return response.data.data
}

export const deleteServices = async (serviceId) => {
  const response = await apiRequest({
    url: `/api/services/${serviceId}`,
    method: 'DELETE',
  })
  return response.data
}

export const createService = async (serviceData) => {
  const response = await apiRequest({
    url: '/api/services',
    method: 'POST',
    data: serviceData,
  })
  return response.data
}

export const updateService = async (serviceId, serviceData) => {
  const response = await apiRequest({
    url: `/api/services/${serviceId}`,
    method: 'PATCH',
    data: serviceData,
  })
  return response.data
}

////Applications

export const getUserFutureBookings = async () => {
  const response = await apiRequest({
    url: '/api/get-user-future-bookings',
    method: 'GET',
  });
  return response.data;
};

export const getUserCompletedBookings = async () => {
  const response = await apiRequest({
    url: '/api/get-user-completed-bookings',
    method: 'GET',
  });
  return response.data;
};

export const getExpertFutureBookings = async () => {
  const response = await apiRequest({
    url: '/api/get-expert-future-bookings',
    method: 'GET',
  });
  return response.data;
};

export const getExpertCompletedBookings = async () => {
  const response = await apiRequest({
    url: '/api/get-expert-completed-bookings',
    method: 'GET',
  });
  return response.data;
};






