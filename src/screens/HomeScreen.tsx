import { BtnMyLocation, MapView, ReactLogo, SearchBar } from '../components'

export const HomeScreen = () => {
  return (
    <div>
      <MapView></MapView>
      <BtnMyLocation />
      <ReactLogo />
      <SearchBar />
    </div>
  )
}
