import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Container } from 'react-bootstrap';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'; // Optional theme CSS
import logoInf from '../RTL/exportLogo'
import './tableCotizadorPyS.css';
import { Button, toaster } from 'rsuite';
import { SiMicrosoftexcel } from 'react-icons/si';
import InfoRoundIcon from '@rsuite/icons/InfoRound';
import Notifications from './Notifications/Notifications';

function TableCotizadorPyS({ setTdata, data, ...props }) {
    /*   const [tdata, setTData] = useState({}) */
    const containerStyle = useMemo(() => ({ width: '100%' }), []);
    const [gridApi, setGridApi] = useState();
    const [columnApi, setColumnApi] = useState();
    useEffect(() => {
    }, [data])
    const currencyFormatter = (params) => {
        let format = ''
        if (params.value) {
            format = '$' + formatNumber(params.value)
        }
        return format;
    };
    const currencyFormatter2 = (params) => {
        let format = ''
        if (isNaN(params.value)) {
            format = params.value
        } else {
            format = '$' + formatNumber(params.value)
        }
        return format;
    }

    const currencyPorcentaje = (params) => {
        let format = ''
        if (params.value) {
            format = params.value + "%"
        }
        return format
    }


    const [colDefs, setColDefs] = useState(
        [
            //{ field: 'Item' },
            { field: 'SKU', cellStyle: { 'font-weight': 'bold' } },
            { field: 'Descripcion', headerName: 'Descripción de Producto' },
            { field: 'Vendor' },
            { field: 'Cantidad' },

            {
                headerName: 'Mayoristas',
                headerClass: 'Mayoristas',
                children: [
                    { field: 'Vunitario', headerName: "V/Unitario", valueFormatter: currencyFormatter2, cellClass: 'currencyFormatUSD' },
                    {
                        field: 'VTotal', headerName: "V/Total", valueFormatter: currencyFormatter, cellClass: 'currencyFormatUSD'
                    }
                ]
            },

            {
                field: 'Porc_UtilidadMU', headerName: '% Utilidad Mínima Unidad', valueFormatter: currencyPorcentaje, cellEditor: 'agSelectCellEditor', cellClass: 'percentFormat'

            },
            { field: 'UtilidadxU', headerName: 'Utilidad x Unidad', valueFormatter: currencyFormatter, cellStyle: { 'font-weight': 'bold' }, cellClass: 'utilityxUnidadFormat' },
            {
                headerName: 'Cliente en Dólares',
                headerClass: 'ClienteDolares',
                children: [
                    { field: 'PrecioVentMxU_USD', headerName: 'Precio de Venta mínima  x Und. (USD)', valueFormatter: currencyFormatter2, cellClass: 'currencyFormatUSD' },
                    { field: 'PrecioVentxI_USD', headerName: 'Precio de Venta x Item (USD)', valueFormatter: currencyFormatter, cellStyle: { 'font-weight': 'bold' }, cellClass: 'currencyFormatUSD' },
                ]
            },

            { field: 'Porc_UtilidadVentTotal', headerName: '% Utilidad Venta Total', valueFormatter: currencyPorcentaje, cellClass: 'percentFormat' },
            { field: 'UtilidadTotal', headerName: 'Utilidad Total', valueFormatter: currencyFormatter, cellClass: 'utilityxUnidadFormat' },
            { field: 'TRM_base', headerName: 'TRM Base', valueFormatter: currencyFormatter, cellClass: 'currencyFormatUSD' },
            {
                headerName: 'Cliente en Pesos',
                headerClass: 'ClientePesos',
                children: [
                    { field: 'PrecioVentMxU_COP', headerName: 'Precio de Venta mínima  x Und. (COP)', valueFormatter: currencyFormatter2, cellClass: 'clientCOPFormat' },
                    { field: 'PrecioVentxItem_COP', headerName: 'Precio de Venta x Item (COP)', valueFormatter: currencyFormatter, cellStyle: { 'font-weight': 'bold' }, cellClass: 'clientCOPFormat' },
                ]
            },


        ]);
    const sideBar = {
        toolPanels: [
            {
                id: 'columns',
                labelDefault: 'Columns',
                labelKey: 'columns',
                iconKey: 'columns',
                toolPanel: 'agColumnsToolPanel',
                toolPanelParams: {
                    suppressRowGroups: true,
                    suppressValues: true,
                }
            }
        ]
    };
    const onGridReady = (params) => {
        setGridApi(params.api);
        setColumnApi(params.columnApi)

    };
    useEffect(() => {
        if (columnApi) {
            //console.log(columnApi.getAllGridColumns())
            let pinnedBottomData = generatePinnedBottomData();
            gridApi.setPinnedBottomRowData([pinnedBottomData]);
        }
    }, [data])


    const defaultColDef = useMemo(() => {
        return {

            editable: false,
        };
    }, []);
    const messageSuccesExport = (
        <Notifications type={'success'} header={'Hecho'}  >
            Se exporto los datos a Excel correctamente!
        </Notifications>
    )
    const onBtExport = () => {
        gridApi.exportDataAsExcel();
        toaster.push(messageSuccesExport, { placement: 'topEnd' })

        /*  toaster.push(message, { placement: 'topEnd' }) */
    };


    const formatNumber = (number) => {
        // this puts commas into the number eg 1000 goes to 1,000,
        // i pulled this from stack overflow, i have no idea how it works
        return Math.floor(number)
            .toString()
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    };
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
            id: 'currencyFormatUSD',
            numberFormat: {
                format: '$#,###'
            }
        },
        {
            id: 'percentFormat',
            numberFormat: {
                format: ''
            }
        },
        {
            id: 'utilityxUnidadFormat',
            numberFormat: {
                format: '$###'
            }
        },
        {
            id: 'clientCOPFormat',
            numberFormat: {
                format: '$##,###,###'
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
            if (rowIndex !== 2 || col.getColId() !== 'SKU') {
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

    const onRowSelected = useCallback((event) => {

        if (event.node.isSelected()) {
            setTdata([{
                'SKU': event.node.data.SKU,
                'Descripcion': event.node.data.Descripcion,
                'Cantidad': event.node.data.Cantidad,
                'Vunitario': event.node.data.Vunitario,
                'SKPorc_UtilidadMU': event.node.data.Porc_UtilidadMU,
            }])
        }

    }, []);

    function generatePinnedBottomData() {
        // generate a row-data with null values
        let result = {};

        columnApi.getAllGridColumns().forEach(item => {
            result[item.colId] = null;
        });
        return calculatePinnedBottomData(result);
    }
    function calculatePinnedBottomData(target) {
        //console.log(target);
        //list of columns fo aggregation
        let columnsWithAggregation = ['VTotal', 'PrecioVentxI_USD', 'PrecioVentxItem_COP']
        columnsWithAggregation.forEach(element => {
            /*  console.log('element', element); */
            gridApi.forEachNodeAfterFilter((rowNode) => {
                if (rowNode.data[element])
                    target[element] += Number(rowNode.data[element]);
            });
            if (target[element])
                target[element] = target[element];
        })
        //console.log(target);
        target['Vunitario'] = 'Total sin IVA:';
        target['PrecioVentMxU_USD'] = 'Precio USD sin IVA:';
        target['PrecioVentMxU_COP'] = 'Precio COP sin IVA:';
        return target;
    }

    return (
        <div style={containerStyle}>

            <div className='d-flex justify-content-between align-items-center '>
                <p className=' bg-warning text-white text-center ms-3 p-1 opacity-75 rounded-1'>
                    <InfoRoundIcon className='ms-1 me-1' />Para más acciones seleccione una fila de la tabla
                </p>
                <Button style={{ backgroundColor: "#001529", color: "white" }} appearance="primary" className='mb-3 me-4' onClick={onBtExport} >Export to Excel <SiMicrosoftexcel /></Button>
            </div>
            <Container style={containerStyle} className='ag-theme-alpine'>

                <AgGridReact
                    columnDefs={colDefs}
                    rowData={data}
                    sideBar={sideBar}
                    onGridReady={onGridReady}
                    pagination={true}
                    defaultColDef={defaultColDef}
                    excelStyles={excelStyles}
                    domLayout='autoHeight'
                    rowSelection='single'
                    defaultExcelExportParams={defaultExcelExportParams}
                    onRowSelected={onRowSelected}
                    getRowStyle={function (params) {
                        if (params.node.rowPinned) {
                            return { 'font-weight': 'bold' };
                        }
                    }}
                    overlayNoRowsTemplate={
                        '<span style="padding: 10px; border: 2px solid white; background: #1A5C91 ; color: white">Agregue un nuevo costeo para verlo aqui</span>'
                    }
                >
                </AgGridReact>
            </Container>

        </div>


    )
}

export default TableCotizadorPyS