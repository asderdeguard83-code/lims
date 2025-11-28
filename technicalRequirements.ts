import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api/technical-requirements',
  timeout: 10000
})

// Интерцептор для обработки ошибок
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export const technicalRequirementsAPI = {
  getProducts: () => apiClient.get('/products'),
  createProduct: (productData: any) => apiClient.post('/products', productData),
  updateProduct: (id: string, productData: any) => 
    apiClient.put(`/products/${id}`, productData),
  deleteProduct: (id: string) => apiClient.delete(`/products/${id}`),
  
  getSets: () => apiClient.get('/sets'),
  createSet: (setData: any) => apiClient.post('/sets', setData),
  updateSet: (id: string, setData: any) => apiClient.put(`/sets/${id}`, setData),
  deleteSet: (id: string) => apiClient.delete(`/sets/${id}`),
  
  getIndicators: (productId: string) => 
    apiClient.get(`/products/${productId}/indicators`),
  addIndicators: (productId: string, indicators: any[]) =>
    apiClient.post(`/products/${productId}/indicators`, { indicators }),
  deleteIndicators: (productId: string, indicatorIds: string[]) =>
    apiClient.delete(`/products/${productId}/indicators`, { 
      data: { indicatorIds } 
    }),
  
  getCharacteristics: (productId: string) =>
    apiClient.get(`/products/${productId}/characteristics`),
  updateCharacteristics: (productId: string, characteristics: any[]) =>
    apiClient.put(`/products/${productId}/characteristics`, { characteristics })
}