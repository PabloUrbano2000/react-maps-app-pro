import logoReact from '../logo.svg'

export const ReactLogo = () => {
  return (
    <div>
      <img
        src={logoReact}
        alt='React logo'
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '130px'
        }}
      />
    </div>
  )
}
