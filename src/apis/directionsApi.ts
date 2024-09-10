import axios from 'axios'

const directionsApi = axios.create({
  baseURL: 'https://api.mapbox.com/directions/v5/mapbox/driving',
  params: {
    alternatives: false,
    language: 'es',
    steps: false,
    geometries: 'geojson',
    overview: 'simplified',
    access_token:
      'pk.eyJ1IjoicGFibG9lbG1hbGR5IiwiYSI6ImNsYjZuM2N0MTAybnozcnFjcjRraXV6ZzMifQ.Yh6DWU2cQ9qI84sJ5K1ljw'
  }
})

export default directionsApi
