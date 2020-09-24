import React, { useState, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
} from '@map-colonies/react-core';
import { observer } from 'mobx-react-lite';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {
  ColDef,
  CellClickedEvent,
  ValueFormatterParams,
  IsColumnFuncParams,
  ValueParserParams,
} from 'ag-grid-community';
import { Box } from '@map-colonies/react-components';
import { FormattedMessage, useIntl } from 'react-intl';
import { useStore } from '../../models/rootStore';
import './export-table-dialog.css';
import { ProgressRenderer } from './cell-renderer/progress.cell-renderer';
import { LinkRenderer } from './cell-renderer/link.cell-renderer';

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    spacer: {
      marginRight: '16px'
    },
    errorContainer: {
      display: 'flex',
      alignItems: 'center',
      marginRight: 'auto',
      color: theme.palette.error.main,
    },
    noBorder: {
      border: 'unset',
    },
    readOnly: {
      backgroundColor: 'transparent !important',
    },
    infoLabel: {
      width: '110px',
    },
  })
);



interface ExportSatusTableDialogProps {
  isOpen: boolean;
  onSetOpen: (open: boolean) => void;
}

export const ExportSatusTableDialog: React.FC<ExportSatusTableDialogProps> = observer((
  props
) => {
  const { exporterStore } = useStore();
  const { isOpen, onSetOpen } = props;
  const classes = useStyle();
  const intl = useIntl();
  const [colDef, setColDef] = useState<ColDef[]>([]);
  const [rowData, setRowData] = useState([]);

  const handleClose = (): void => {
    onSetOpen(false);
  };

  useEffect(()=>{
    // File name | Est Size | Status | (URI) Link to download | Date | Progress
    setColDef([
      {
        headerName: intl.formatMessage({ id: 'export-table.table-column-header.fileName.text' }),
        width: 200,
        field: 'fileName',
        suppressMovable: true,
      },
      {
        headerName: intl.formatMessage({ id: 'export-table.table-column-header.sizeEst.text' }),
        width: 120,
        field: 'sizeEst',
        suppressMovable: true,
      },
      {
        headerName: intl.formatMessage({ id: 'export-table.table-column-header.tilesEst.text' }),
        width: 100,
        field: 'tilesEst',
        suppressMovable: true,
      },
      {
        headerName: intl.formatMessage({ id: 'export-table.table-column-header.status.text' }),
        width: 120,
        field: 'status',
        suppressMovable: true,
      },
      {
        headerName: intl.formatMessage({ id: 'export-table.table-column-header.link.text' }),
        width: 120,
        field: 'link',
        cellRenderer: 'linkRenderer',
        suppressMovable: true,
      },
      {
        headerName: intl.formatMessage({ id: 'export-table.table-column-header.date.text' }),
        width: 120,
        field: 'date',
        suppressMovable: true,
      },
      {
        headerName: intl.formatMessage({ id: 'export-table.table-column-header.progress.text' }),
        width: 120,
        field: 'progress',
        cellRenderer: 'progressRenderer',
        suppressMovable: true,
      },

    ]);

  },[]);

  useEffect(( )=>{
    setRowData(exporterStore.exportedPackages);
  },[exporterStore.exportedPackages]);

  useEffect(() => {
    if(isOpen){
      exporterStore.getGeoPackages();
    }
  },[isOpen]);
 
  return (
    <Box id="exportTable">
      <Dialog open={isOpen}>
        <DialogTitle>
          <FormattedMessage id="export-table.dialog.title" />
        </DialogTitle>
        <DialogContent>
          <Box
            className="ag-theme-alpine"
            style={{
              height: '450px',
              width: '910px',
            }}
          >
            <AgGridReact
              columnDefs={colDef}
              rowData={rowData}
              frameworkComponents={{
                progressRenderer: ProgressRenderer,
                linkRenderer: LinkRenderer,
              }}
              />
          </Box> 
          <Box style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', gap: '16px' }}>
            <Button 
              raised 
              onClick={handleClose}
            >
              <FormattedMessage id="general.ok-btn.text" />
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
});
