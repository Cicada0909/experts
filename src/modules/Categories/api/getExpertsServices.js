import { apiRequest } from "../../../utils/api.js"    

export const getExpertServicesById = async (expertId) => {
  const response = await apiRequest({
    url: `/api/experts/${expertId}/services`,
    method: 'GET',
  })
  return response.data
}



export const addSlot = async (expertId, slot) => {
  console.log('Отправка запроса addSlot:', { expertId, slot });
  const response = await apiRequest({
    url: `/api/services/${expertId}/bookings`,
    method: 'POST',
    data: {
      date: slot.date,
      time: slot.time,
    },
  });
  console.log('Ответ от API addSlot:', response.data);
  return response.data;
};


export const createServiceBooking = async (serviceId) => {
  const response = await apiRequest({
    url: `/api/services/${serviceId}/bookings`,
    method: 'POST',
  })
  return response.data
}
