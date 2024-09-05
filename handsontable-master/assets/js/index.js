const BillTable = function() {
    const container = document.querySelector("#bill");
    const colHeaders = [
        'ID',
        'MainBIllID',
        'Currency',
        'ItemDelDate',
        'DNNum',
        'SORefNum',
        'ItemNum',
        'VendorModel',
        'ItemAttr',
        'ItemDesc',
        'ItemQty',
        'ItemPrice',
        'ItemSubTotal',
        'Approved',
        'Remark',
        'SalesItemID'
    ];
    const columns = [
        {
            data: 'BillItemID',
            readOnly: true
        },
        {
            data: 'MainBIllID',
            readOnly: true
        },
        {
            data: 'Currency',
            readOnly: true
        },
        {
            data: 'ItemDelDate',
            type: 'date',
            dateFormat: 'YYYY-MM-DD 00:00:00',
            correctFormat: true,
        },
        {
            data: 'DNNum'
        },
        {
            data: 'SORefNum',
            renderer: 'html'
        },
        {
            data: 'ItemNum'
        },
        {
            data: 'VendorModel'
        },
        {
            data: 'ItemAttr'
        },
        {
            data: 'ItemDesc'
        },
        {
            data: 'ItemQty',
            type: 'numeric',
            editor: 'numeric'
        },
        {
            data: 'ItemPrice',
            type: 'numeric',
            editor: 'numeric',
            numericFormat: {
                pattern: '$ 0,0.00'
            }
        },
        {
            data: 'ItemSubTotal',
            type: 'numeric',
            numericFormat: {
                pattern: '$ 0,0.00'
            },
            readOnly: true
        },
        {
            data: 'Approved',
            type: 'checkbox',
            checkedTemplate: 1,
            uncheckedTemplate: 0,
        },
        {
            data: 'Remark'
        },
        {
            data: 'SalesItemID'
        }
    ];

    const insertLastRow = data => {
        let rowCnt = data.length;

        data = data.map( ( value, index ) => {
            value.ItemSubTotal = `=K${index + 1}*L${index + 1}`;
            return value;
        });

        data.push( { "ItemSubTotal": `=SUM(M1:M${ rowCnt })` } );

        return data;
    }

    const isValid = params => {
        if( params.ItemQty && typeof params.ItemQty != 'number' )
            return false;
        
        if( params.ItemPrice && typeof params.ItemPrice != 'number' )
            return false;
        
        if( params.ItemSubTotal && typeof params.ItemSubTotal != 'number' )
            return false;

        return true;
    }

    const afterChangeHandler = ( change, source ) => {
        if (source === 'loadData') {
            return; //don't save this change
        }

        change.forEach(([rowIndex, infoIndex, oldValue, newValue]) => {
            if( infoIndex == 'BillItemID' || infoIndex == 'MainBIllID' || infoIndex == 'Currency' ) {
                return;
            }

            if( oldValue != newValue ) {
                $('.save').removeClass('btn-muted');

                const row = billTable.getDataAtRow(rowIndex);
                const update = {
                    [infoIndex]: newValue
                }
                if( infoIndex === 'ItemQty' || infoIndex === 'ItemPrice' ) {
                    update.ItemSubTotal = row[12];
                }
                if( isValid(update) ) {
                    changes[ row[0] ] = {
                        ...changes[ row[0] ],
                        ...update
                    };
                }
            }
        });
    }

    const beforeRemoveRowHandler = (removes, amount, physicalRows) => {
        let removedBillItemIDs = [];
        physicalRows.forEach(rowIndex => {
            const row = billTable.getDataAtRow(rowIndex);
            removedBillItemIDs.push( row[0] );
        });

        ajaxRequest({ type: 'remove', BillItemIDs: removedBillItemIDs });
    }

    const afterCreateRowHandler = create => {

        ajaxRequest({ type: 'create' }, response => {
            billTable.setDataAtCell(create, 0, response.data.BillItemID);
            billTable.setDataAtCell(create, 1, response.data.MainBIllID);
            billTable.setDataAtCell(create, 2, response.data.Currency);
            billTable.setDataAtCell(create, 10, 0);
            billTable.setDataAtCell(create, 11, '0.0000');
            billTable.setDataAtCell(create, 12, `=K${create + 1}*L${create + 1}`);
        });
    }

    const ajaxRequest = (data, cb) => {
        $.ajax({
            method: 'POST',
            url: 'http://localhost',
            dataType: 'json',
            data: data,
            success: function(res) {
                if ( res.success ) {
                    if (typeof cb === 'function') cb(res);
                } else {
                    alert( 'Fail ' + data.type + '. Try again.');
                }
            }, 
            error: function(err) {
                console.log(err);
                alert('Error is occuered!');
            }
        });
    }

    function SORefNumRenderer(instance, td, row, col, prop, value, cellProperties) {
        Handsontable.renderers.TextRenderer.apply(this, arguments);
        td.className='text-danger htCenter htMiddle';
    }

    let changes = {};
    
    let billTable = null;

    return {
        init: function( data ) {

            billTable = new Handsontable(container, {
                columns,
                data: insertLastRow(data),
                formulas: {
                    engine: HyperFormula,
                },
                colHeaders: colHeaders,
                height: 'auto',
                width: 'auto',
                hiddenColumns: {
                    columns: [/*0, 1, 2,*/ 15],
                    indicators: true
                },
                contextMenu: ['row_above', 'row_below', 'remove_row', 'alignment', 'copy'],
                manualColumnResize: true,
                fixedRowsBottom: 1,
                stretchH: 'all',
                height: 'calc(100vh - 80px)',
                licenseKey: 'non-commercial-and-evaluation',
                rowHeights: 40,
                manualRowResize: true,
                className: 'htCenter htMiddle',
                afterChange: afterChangeHandler,
                beforeRemoveRow: beforeRemoveRowHandler,
                afterCreateRow: afterCreateRowHandler,
                cells(row, col, prop) {
                    const cellProperties = {};

                    if( col === 5 && this.instance.getDataAtRow(row)[15] === null ) {
                        cellProperties.renderer = SORefNumRenderer;
                    }

                    if( row === this.instance.countRows() - 1 ) {
                        cellProperties.readOnly = true;
                    }

                    return cellProperties;
                }
            });
        },
        save: function() {
            if( Object.keys(changes).length === 0 ) return;

            ajaxRequest({ type: 'update', changes }, function(res) {
                changes = {};
                $('.save').addClass('btn-muted');
            });
        }
    }
}();