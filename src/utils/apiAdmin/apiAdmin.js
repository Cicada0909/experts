import { apiRequest, apiRequestWithBlob } from "../api.js";


export const deleteExpert = async (expertId) => {
  const response = await apiRequest({
    url: `/api/experts/${expertId}`,
    method: 'DELETE',
  })
  return response.data
}



export const downloadExpertsExcel = async () => {
  const response = await apiRequest({
    url: '/api/experts-to-excel',
    method: 'GET',
    responseType: 'blob',
  })


  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'users.xlsx')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)

  return response.data
}

export const downloadUsers = async () => {
  const response = await apiRequest({
    url: '/api/users-to-excel',
    method: 'GET',
    responseType: 'blob',
  })


  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'users.xlsx')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)

  return response.data
}


export const downloadStatiscs = async () => {
  const response = await apiRequest({
    url: '/api/statistics',
    method: 'GET',
    responseType: 'blob',
  })


  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'users.xlsx')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)

  return response.data
}


export const downloadApplications = async () => {
  const response = await apiRequest({
    url: '/api/rejected-bookings',
    method: 'GET',
    responseType: 'blob',
  })


  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'users.xlsx')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)

  return response.data
}
