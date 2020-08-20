import React from 'react';
import { Polygon } from 'geojson';
import { Menu, 
  MenuItem,
  Button,
  Tooltip,
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  DialogButton } from '@map-colonies/react-core';
import '@map-colonies/react-core/dist/button/styles';
import '@map-colonies/react-core/dist/tooltip/styles';
import '@map-colonies/react-core/dist/menu/styles';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { Box, DrawType } from '@map-colonies/react-components';

const WIDTH_SPACING_FACTOR = 18;
const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    drawingButton: {
      width: theme.spacing(WIDTH_SPACING_FACTOR),
    },
    fullWidth: {
      width: '100%',
      marginTop: '36px',
    },
  })
);

export interface PolygonSelectionUiProps {
  isSelectionEnabled: boolean;
  onStartDraw: (type: DrawType) => void;
  onCancelDraw: () => void;
  onReset: () => void;
  onPolygonUpdate: (polygon: Polygon) => void;
}

export const PolygonSelectionUi: React.FC<PolygonSelectionUiProps> = (
  props
) => {
  const classes = useStyle();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { isSelectionEnabled, onCancelDraw, onStartDraw, onReset, onPolygonUpdate } = props;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const [open, setOpen] = React.useState(false);

  if (isSelectionEnabled) {
    return (
      <Tooltip content="Cancel the ongoing draw" align={'bottomLeft'}>
        <Button className={classes.drawingButton} raised onClick={onCancelDraw}>
          Cancel Draw
        </Button>
      </Tooltip>
    );
  } else {
    return (
      <Box position="relative">
        <Tooltip
          content="draw an Area of interest to limit the search"
          align={'bottomLeft'}
        >
          <Button
            className={classes.drawingButton}
            raised
            onClick={handleClick}
          >
            Draw AOI
          </Button>
        </Tooltip>
        <Dialog
          open={open}
          onClose={evt => {
            const SAMPLE_POLYGON: Polygon={
              type:"Polygon",
              coordinates:[[
                  [34.70371442859832,32.022954156119006],
                  [35.146463443653914,32.022954156119006],
                  [35.146463443653914,32.23608887564354],
                  [34.70371442859832,32.23608887564354],
                  [34.70371442859832,32.022954156119006]
              ]]
            };
          
            console.log(evt.detail.action);
            onPolygonUpdate(SAMPLE_POLYGON);
            setOpen(false);
          }}
          onClosed={evt => console.log(evt.detail.action)}
        >
          <DialogTitle>Define bbox coordinates</DialogTitle>
          <DialogContent>This is a standard dialog.</DialogContent>
          <DialogActions>
            <DialogButton action="close">Cancel</DialogButton>
            <DialogButton raised action="accept" isDefaultAction>
              Ok
            </DialogButton>
          </DialogActions>
        </Dialog>
        <Menu
          className={classes.fullWidth}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {/* <MenuItem
            onClick={(): void => {
              onStartDraw(DrawType.POLYGON);
              handleClose();
            }}
          >
            Polygon
          </MenuItem> */}
          <MenuItem
            onClick={(): void => {
              onStartDraw(DrawType.BOX);
              handleClose();
            }}
          >
            Box
          </MenuItem>
          <MenuItem
            onClick={(): void => {
              // onStartDraw(DrawType.BOX);
              setOpen(true);
              handleClose();
            }}
          >
            Box by coordinates
          </MenuItem>
          <MenuItem
            onClick={(): void => {
              onReset();
              handleClose();
            }}
          >
            Clear
          </MenuItem>
        </Menu>
      </Box>
    );
  }
};
