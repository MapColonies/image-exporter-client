import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { LinearProgress, Typography } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import './progress.cell-renderer.css';
import { IGeoPackage } from '../../../models/geoPackage';

const ONE_HUNDRED = 100;
export const ProgressRenderer: React.FC<ICellRendererParams> = (
  props
) => {
  const value: number = (props.data as IGeoPackage).progress; 
  if (!value) {
    return <></>;//''; // not null!
  }
  const getProgressValue = ():number => {
    return value > 1 ? (value / ONE_HUNDRED) : value;
  }

  const getPercentageText = ():string => {
    return value > 1 ? `${value}%` : `${value * ONE_HUNDRED}%`;
  }

  // return (
  //   props.data.progress
  // );
  return (
    <Box style={{display: 'flex', height: '40px', alignItems: 'center'}}>
      <Typography use="body1" className={'rendererLabel'}>{getPercentageText()}</Typography>
      <LinearProgress progress={getProgressValue()} />
    </Box>
  );

};

// export class ProgressRenderer extends React.Component<any,any> {
//   constructor(props:any) {
//     super(props);

//     this.state = {
//       value: props.value,
//     };
//   }

//   formatValueToCurrency(currency:any, value:any) {
//     return `${currency}${value.toFixed(2)}`;
//   }

//   getProgressValue():number {
//     return this.state.value > 1 ? this.state.value/100 : this.state.value;
//   }
//   // noinspection JSUnusedGlobalSymbols
//   refresh(params:any) {
//     if (params.value !== this.state.value) {
//       this.setState({
//         value: params.value,
//       });
//     }
//     return true;
//   }

//   render() {
//     console.log('Render PROGRESS');
//     // return <span>{this.formatValueToCurrency('EUR', this.state.value)}</span>;
//     return (
//       <div style={{display: 'flex', height: '40px', alignItems: 'center'}}>
//         <span style={{
//           fontSize: '12px',
//           position: 'absolute',
//           left: '50%',
//           top: '-12px'
//         }}>
//           80%
//         </span>
//         <Typography use="body1" className={classes.infoLabel}></Typography>
//         <LinearProgress progress={this.getProgressValue()} />
//       </div>
//     );
//   }
// }