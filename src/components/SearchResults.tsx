import { useContext, useState } from 'react'
import { MapContext, PlacesContext } from '../context'
import { Feature } from '../interfaces/places'
import { LoadingPlaces } from './LoadingPlaces'

export const SearchResults = () => {
  const { places, isLoadingPlaces, userLocation } = useContext(PlacesContext)
  const { map, getRouteBetweenPoints } = useContext(MapContext)

  const [activeId, setActiveId] = useState('')

  const onPlaceClicked = (place: Feature) => {
    const [lng, lat] = place.geometry.coordinates
    setActiveId(place.id)
    map?.flyTo({ zoom: 14, center: [lng, lat] })
  }

  const getRoute = (place: Feature) => {
    if (!userLocation) return
    const [lng, lat] = place.geometry.coordinates
    getRouteBetweenPoints(userLocation, [lng, lat])
  }

  if (isLoadingPlaces) {
    return <LoadingPlaces />
  }

  if (places.length === 0) {
    return <></>
  }

  return (
    <ul className='list-group mt-3'>
      {places.map((place) => (
        <li
          key={place.id}
          className={`${
            activeId === place.id ? 'active' : ''
          } pointer list-group-item list-group-item-action`}
          onClick={() => onPlaceClicked(place)}
        >
          <h6>{place.properties.name}</h6>
          <p style={{ fontSize: '12px' }}>{place.properties.full_address}</p>
          <button
            onClick={() => getRoute(place)}
            type='button'
            className={`btn btn-sm ${
              activeId === place.id
                ? 'btn-outline-light'
                : 'btn-outline-primary'
            }`}
          >
            Direcciones
          </button>
        </li>
      ))}
    </ul>
  )
}
