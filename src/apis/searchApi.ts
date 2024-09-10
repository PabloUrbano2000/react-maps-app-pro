import axios from 'axios'

const searchApi = axios.create({
  baseURL: 'https://api.mapbox.com/search/geocode/v6',
  params: {
    limit: 5,
    language: 'es',
    access_token:
      'pk.eyJ1IjoicGFibG9lbG1hbGR5IiwiYSI6ImNsYjZuM2N0MTAybnozcnFjcjRraXV6ZzMifQ.Yh6DWU2cQ9qI84sJ5K1ljw'
  }
})

export default searchApi
