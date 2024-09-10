import {
  LngLatBounds,
  Map,
  Marker,
  Popup,
  SourceSpecification
} from 'mapbox-gl'
import { useContext, useEffect, useReducer } from 'react'
import { directionsApi } from '../../apis'
import { DirectionsResponse } from '../../interfaces/directions'
import { PlacesContext } from '../places/PlacesContext'
import { MapContext } from './MapContext'
import { mapReducer } from './mapReducer'

export interface MapState {
  isMapReady: boolean
  map?: Map
  markers: Marker[]
}

const INITIAL_STATE: MapState = {
  isMapReady: false,
  map: undefined,
  markers: []
}

interface Props {
  children: JSX.Element | JSX.Element[]
}

export const MapProvider = ({ children }: Props) => {
  const { places } = useContext(PlacesContext)

  const [state, dispatch] = useReducer(mapReducer, INITIAL_STATE)

  useEffect(() => {
    state.markers.forEach((marker) => marker.remove())
    const newMarkers: Marker[] = []
    for (const place of places) {
      const [lng, lat] = place.geometry.coordinates
      const popup = new Popup().setHTML(`
        <h6>${place.properties.name}</h6>
        <p>${place.properties.name_preferred}</p>`)
      const newMarker = new Marker()
        .setPopup(popup)
        .setLngLat([lng, lat])
        .addTo(state.map!)

      newMarkers.push(newMarker)
    }
    // limpiar los anteriores markers
    dispatch({ type: 'setMarkers', payload: newMarkers })
  }, [places])

  const setMap = (map: Map) => {
    const myLocationPopup = new Popup().setHTML(`
      <h4>Aqui estoy</h4>
      <p>En algún lugar del mundo</p>`)

    new Marker({
      color: '#61DAFB'
    })
      .setLngLat(map.getCenter())
      .setPopup(myLocationPopup)
      .addTo(map)
    dispatch({ type: 'setMap', payload: map })
  }

  const getRouteBetweenPoints = async (
    start: [number, number],
    end: [number, number]
  ) => {
    const resp = await directionsApi<DirectionsResponse>(
      `/${start.join(',')};${end.join(',')}`
    )
    console.log(resp)

    const { distance, duration, geometry } = resp.data.routes[0]

    const { coordinates: coords } = geometry

    let kms = distance / 1000
    kms = Math.round(kms * 100)
    kms /= 100

    const minutes = Math.floor(duration / 60)
    console.log({ kms, minutes })

    const bounds = new LngLatBounds(start, start)

    for (const coord of coords) {
      const newCoord: [number, number] = [coord[0], coord[1]]
      bounds.extend(newCoord)
    }

    state.map?.fitBounds(bounds, {
      padding: 200
    })

    // Polyline
    const sourceData: SourceSpecification = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coords
            }
          }
        ]
      }
    }

    // Todo: remover polyline de existir
    if (state.map?.getLayer('RouteString')) {
      state.map.removeLayer('RouteString')
      state.map.removeSource('RouteString')
    }

    state.map?.addSource('RouteString', sourceData)
    state.map?.addLayer({
      id: 'RouteString',
      type: 'line',
      source: 'RouteString',
      layout: {
        'line-cap': 'round',
        'line-join': 'round'
      },
      paint: {
        'line-color': 'black',
        'line-width': 3
      }
    })
  }

  return (
    <MapContext.Provider
      value={{
        ...state,
        setMap,
        getRouteBetweenPoints
      }}
    >
      {children}
    </MapContext.Provider>
  )
}
