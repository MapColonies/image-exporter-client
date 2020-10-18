import React, { useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import moment from 'moment';
import { observer } from 'mobx-react-lite';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ICellRendererParams } from 'ag-grid-community';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
} from '@map-colonies/react-core';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { Box } from '@map-colonies/react-components';
import { useStore } from '../../models/rootStore';
import { IExportTaskStatus } from '../../models/exportTaskStatus';
import { ProgressRenderer } from './cell-renderer/progress.cell-renderer';
import { LinkRenderer } from './cell-renderer/link.cell-renderer';
import './export-table-dialog.css';

interface ExportSatusTableDialogProps {
  isOpen: boolean;
  onSetOpen: (open: boolean) => void;
}

export const ExportSatusTableDialog: React.FC<ExportSatusTableDialogProps> = observer((
  props
) => {
  const { exporterStore } = useStore();
  const { isOpen, onSetOpen } = props;
  const intl = useIntl();
  const [colDef, setColDef] = useState<ColDef[]>([]);
  const [rowData, setRowData] = useState([]);

  const handleClose = (): void => {
    onSetOpen(false);
  };

  const renderDate = (date : Date | undefined): string => {
    return date ? moment(date).format('DD/MM/YYYY HH:mm') : "-";
  }

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
        headerName: intl.formatMessage({ id: 'export-table.table-column-header.bbox.text' }),
        width: 800,
        field: 'bbox',
        cellRenderer: (props : ICellRendererParams) : string => {
          const data = props.data as IExportTaskStatus;
          const bbox = data.bbox;
          return bbox ? `Top right: ${bbox.topRight.lat}, ${bbox.topRight.lon}, Bottom left: ${bbox.bottomLeft.lat}, ${bbox.bottomLeft.lon}` : '';
        },
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
        headerName: intl.formatMessage({ id: 'export-table.table-column-header.creationDate.text' }),
        width: 170,
        field: 'creationDate',
        cellRenderer: (props : ICellRendererParams) : string => {
          const data = props.data as IExportTaskStatus;
          return renderDate(data.creationDate);
        },
        suppressMovable: true,
      },
      {
        headerName: intl.formatMessage({ id: 'export-table.table-column-header.lastUpdateTime.text' }),
        width: 170,
        field: 'lastUpdateTime',
        cellRenderer: (props : ICellRendererParams) : string => {
          const data = props.data as IExportTaskStatus;
          return renderDate(data.lastUpdateTime);
        },
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

  },[intl]);

  useEffect(( )=>{
    setRowData(exporterStore.exportedPackages);
  },[exporterStore.exportedPackages]);

  useEffect(() => {
    if(isOpen){
      void exporterStore.getGeoPackages();
    }
  },[isOpen, exporterStore]);
 
  return (
    <Box id="exportTable">
      <Dialog open={isOpen} preventOutsideDismiss={true}>
        <DialogTitle>
          <FormattedMessage id="export-table.dialog.title" />
        </DialogTitle>
        <DialogContent>
          <Box
            className="ag-theme-alpine"
            style={{
              height: '450px',
              width: '960px',
            }}
          >
            <AgGridReact
              columnDefs={colDef}
              rowData={rowData}
              overlayNoRowsTemplate={intl.formatMessage({ id: 'export-table.nodata' })}
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
