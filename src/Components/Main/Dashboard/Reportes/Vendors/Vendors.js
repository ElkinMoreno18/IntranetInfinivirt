import React from 'react'

class informeVendors extends React.Component {
  render () {
    return (
      <>
        <h3 className='text-center'>Informe de Vendors</h3>
        <iframe
          title='Informe de Vendors - Informe de Vendors'
          width='1140'
          height='541.25'
          src='https://app.powerbi.com/reportEmbed?reportId=3e600c22-2533-4644-a7e0-2fac6d8f3da1&autoAuth=true&ctid=5ab1b681-6350-4b51-aa70-20fe07a5751c&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXBhYXMtMS1zY3VzLXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0LyJ9'
          allowFullScreen={true}
          style={{ border: 'none', width: '100%', height: '94%' }}
        ></iframe>
      </>
    )
  }
}

export default informeVendors
