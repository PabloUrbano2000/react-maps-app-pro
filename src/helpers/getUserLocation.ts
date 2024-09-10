export async function getUserLocation(): Promise<[number, number]> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        resolve([coords.longitude, coords.latitude])
      },
      (err) => {
        alert('No se pudo obtener la geolocalización')
        console.log(err)
        return reject()
      }
    )
  })
}
