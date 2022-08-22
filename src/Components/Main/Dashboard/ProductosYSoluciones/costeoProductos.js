import React, { useCallback, useMemo, useRef, useState } from 'react'
import './costeoProductos.css'
import logoInf from '../RTL/exportLogo'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-enterprise'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'

var url_base = process.env.REACT_APP_DB_HOST

const CosteoProductos = () => {
  const gridRef = useRef()
  const [rowData, setRowData] = useState()

  const [excelStyles] = useState([
    {
      id: 'logo',
      alignment: {
        horizontal: 'Center',
        vertical: 'Center'
      }
    },
    {
      id: 'headerFile',
      font: {
        color: '#000000',
        fontName: 'Lato',
        bold: true,
        size: 20
      },
      alignment: {
        horizontal: 'Center',
        vertical: 'Center',
        wrapText: true
      }
    },
    {
      id: 'cellBold',
      borders: {
        borderBottom: {
          color: '#000000',
          lineStyle: 'Continuous',
          weight: 1
        },
        borderLeft: {
          color: '#000000',
          lineStyle: 'Continuous',
          weight: 1
        },
        borderRight: {
          color: '#000000',
          lineStyle: 'Continuous',
          weight: 1
        },
        borderTop: {
          color: '#000000',
          lineStyle: 'Continuous',
          weight: 1
        }
      },
      interior: {
        color: '#F2F2F2',
        pattern: 'Solid'
      },
      font: {
        size: 11,
        fontName: 'Lato',
        bold: true
      },
      alignment: {
        horizontal: 'Left',
        vertical: 'Center',
        wrapText: true,
        shrinkToFit: true
      }
    },
    {
      id: 'headersTable',
      borders: {
        borderBottom: {
          color: '#000000',
          lineStyle: 'Continuous',
          weight: 1
        },
        borderLeft: {
          color: '#000000',
          lineStyle: 'Continuous',
          weight: 1
        },
        borderRight: {
          color: '#000000',
          lineStyle: 'Continuous',
          weight: 1
        },
        borderTop: {
          color: '#000000',
          lineStyle: 'Continuous',
          weight: 1
        }
      },
      interior: {
        color: '#7B7B7B',
        pattern: 'Solid'
      },
      font: {
        color: '#FFFFFF',
        fontName: 'Lato',
        size: 10
      },
      alignment: {
        horizontal: 'Left',
        vertical: 'Center',
        wrapText: true
      }
    },
    {
      id: 'styleCellsTable',
      borders: {
        borderBottom: {
          color: '#000000',
          lineStyle: 'Continuous',
          weight: 1
        },
        borderLeft: {
          color: '#000000',
          lineStyle: 'Continuous',
          weight: 1
        },
        borderRight: {
          color: '#000000',
          lineStyle: 'Continuous',
          weight: 1
        },
        borderTop: {
          color: '#000000',
          lineStyle: 'Continuous',
          weight: 1
        }
      },
      interior: {
        color: '#F2F2F2',
        pattern: 'Solid'
      },
      font: {
        fontName: 'Lato',
        size: 10
      },
      alignment: {
        horizontal: 'Left',
        vertical: 'Center',
        wrapText: true,
        shrinkToFit: true
      }
    },
    {
      id: 'observations',
      font: {
        fontName: 'Lato Light',
        size: 9,
        color: '#FF0000'
      }
    },
    {
      id: 'styleSkin',
      borders: {
        borderBottom: {
          color: '#000000',
          lineStyle: 'Continuous',
          weight: 1
        },
        borderLeft: {
          color: '#000000',
          lineStyle: 'Continuous',
          weight: 1
        },
        borderRight: {
          color: '#000000',
          lineStyle: 'Continuous',
          weight: 1
        },
        borderTop: {
          color: '#000000',
          lineStyle: 'Continuous',
          weight: 1
        }
      },
      font: {
        fontName: 'Lato Light',
        size: 9
      },
      interior: {
        color: '#FCE4D6',
        pattern: 'Solid'
      },
      alignment: {
        horizontal: 'Left',
        vertical: 'Center',
      }
    },
    {
      id: 'header',
      borders: {
        borderBottom: {
          color: '#000000',
          lineStyle: 'Continuous',
          weight: 1
        },
        borderLeft: {
          color: '#F2F2F2',
          lineStyle: 'Continuous',
          weight: 1
        },
        borderRight: {
          color: '#F2F2F2',
          lineStyle: 'Continuous',
          weight: 1
        },
        borderTop: {
          color: '#F2F2F2',
          lineStyle: 'Continuous',
          weight: 1
        }
      },
      interior: {
        color: '#7B7B7B',
        pattern: 'Solid'
      },
      font: {
        color: '#FFFFFF',
        fontName: 'Lato',
        size: 10
      },
      alignment: {
        horizontal: 'Center',
        vertical: 'Center',
        wrapText: true
      }
    }
  ])

  const [defaultColDef] = useState({
    flex: 1,
    maxWidth: 380,
    sortable: true,
    resizable: true,
    menuTabs: ['filterMenuTab'],
    autoHeaderHeight: true,
    wrapHeaderText: true
  })

  const [defaultExcelExportParams] = useState({
    author: 'Infinivirt',
    fileName: 'Costeo de Productos y Soluciones.xlsx',
    exportMode: 'xlsx',
    sheetName: 'Consolidado',
    prependContent: [
      [],
      [
        {
          data: {
            type: 'String',
            value: logoInf
          },
          styleId: 'logo'
        },
        {
          data: {
            type: 'String',
            value: ''
          }
        },
        {
          data: {
            type: 'String',
            value: 'CONSOLIDADO COSTEO DE PRODUCTOS Y SOLUCIONES'
          },
          styleId: 'headerFile',
          mergeAcross: 14
        }
      ],
      [],
      [
        {
          data: {
            type: 'String',
            value: 'N° '
          },
          styleId: 'cellBold'
        },
        {
          data: {
            type: 'String',
            value: ' '
          },
          styleId: 'cellBold',
          mergeAcross: 1
        }
      ],
      [
        {
          data: {
            type: 'String',
            value: 'Cliente: '
          },
          styleId: 'cellBold'
        },
        {
          data: {
            type: 'String',
            value: ' '
          },
          styleId: 'cellBold',
          mergeAcross: 1
        }
      ],
      [
        {
          data: {
            type: 'String',
            value: 'Fecha: '
          },
          styleId: 'cellBold'
        },
        {
          data: {
            type: 'String',
            value: ' '
          },
          styleId: 'cellBold',
          mergeAcross: 1
        }
      ],
      [
        {
          data: {
            type: 'String',
            value: 'Ref: '
          },
          styleId: 'cellBold'
        },
        {
          data: {
            type: 'String',
            value: ''
          },
          styleId: 'cellBold',
          mergeAcross: 1
        },
        {
          data: {
            type: 'String',
            value: ''
          }
        },
        {
          data: {
            type: 'String',
            value: ''
          }
        },
        {
          data: {
            type: 'String',
            value: ''
          }
        },
        {
          data: {
            type: 'String',
            value: ''
          }
        },
        {
          data: {
            type: 'String',
            value: ''
          }
        },
        {
          data: {
            type: 'String',
            value: ''
          }
        },
        {
          data: {
            type: 'String',
            value: ''
          }
        },
        {
          data: {
            type: 'String',
            value: ''
          }
        },
        {
          data: {
            type: 'String',
            value: 'TRM'
          },
          styleId: 'headersTable'
        },
        {
          data: {
            type: 'String',
            value: ' $ 3.704 '
          },
          styleId: 'styleSkin'
        }
      ],
      [
        {
          data: {
            type: 'String',
            value: 'Proyecto: '
          },
          styleId: 'cellBold'
        },
        {
          data: {
            type: 'String',
            value: ' '
          },
          styleId: 'cellBold',
          mergeAcross: 1
        }
      ],
      [
        {
          data: {
            type: 'String',
            value: 'Proveedor: '
          },
          styleId: 'cellBold'
        },
        {
          data: {
            type: 'String',
            value: ' '
          },
          styleId: 'cellBold',
          mergeAcross: 1
        }
      ],
      []
    ],
    appendContent: [
      [],
      [
        {
          data: {
            type: 'String',
            value: '* Todas las soluciones deben presentarse en dólares.'
          },
          styleId: 'observations'
        }
      ],
      [
        {
          data: {
            type: 'String',
            value: '* No se incluye IVA en este costeo.'
          },
          styleId: 'observations'
        }
      ]
    ],
    rowHeight: params =>
      params.rowIndex === 12 || params.rowIndex === 2 ? 101 : 29,
    columnWidth: params => (params.index === 0 ? 130 : 145),
    addImageToCell: (rowIndex, col, value) => {
      if (rowIndex !== 2 || col.getColId() !== 'athlete') {
        return
      }
      return {
        image: {
          id: 'logo',
          base64: value,
          imageType: 'png',
          width: 480,
          height: 150,
          position: {
            colSpan: 3,
            //rowSpan: 2,
            offsetY: -25
          }
        }
      }
    }
  })

  const [columnDefs] = useState([
    {
      headerName: 'Group A',
      children: [
        { field: 'athlete', minWidth: 200 },
        { field: 'country', minWidth: 200 }
      ]
    },
    {
      headerName: 'Group B',
      children: [
        { field: 'sport', minWidth: 150 },
        { field: 'gold' },
        { field: 'silver' },
        { field: 'bronze' },
        { field: 'total' }
      ]
    }
  ])

  const onGridReady = useCallback(params => {
    /* this.gridApi = params.api
    this.gridColumnApi = params.columnApi */

    fetch('https://www.ag-grid.com/example-assets/small-olympic-winners.json')
      .then(resp => resp.json())
      .then(data => {
        setRowData(data)
      })
  }, [])

  const onBtnExport = useCallback(() => {
    // var filePath = this.state.file_path
    // var request = '/api/files/deleteFile'
    //this.gridApi.exportDataAsExcel()
    gridRef.current.api.exportDataAsExcel()

    // axios.post(url_base + request, filePath).then(data => {})
  }, [])

  return (
    <>
      <button className='btn btn-success mb-3' onClick={onBtnExport}>
        Descargar
      </button>
      <AgGridReact
        ref={gridRef}
        pagination={true}
        enableRangeSelection={true}
        copyHeadersToClipboard={true}
        excelStyles={excelStyles}
        // columnDefs={showColumns}
        columnDefs={columnDefs}
        //defaultColDef={this.state.defaultColDef}
        defaultColDef={defaultColDef}
        rowData={rowData}
        onGridReady={onGridReady}
        defaultExcelExportParams={defaultExcelExportParams}
      ></AgGridReact>
    </>
  )
}

export default CosteoProductos
