import React, { FunctionComponent, useEffect, useState } from 'react';
import { FormGroup, Input, Label } from 'reactstrap';
import {
  IFeeConfig,
  IFeeEthereumConfig,
  IGasEthereumConfig
} from '@owallet/hooks';
import { observer } from 'mobx-react-lite';
import Big from 'big.js';
import { Input as InputEvm } from '../../components/form';

export interface GasInputProps {
  feeConfig: IFeeEthereumConfig;
  gasConfig: IGasEthereumConfig;
  decimals: number;

  label?: string;
  className?: string;
  defaultValue?: number;
  gasPrice?: number | string | Big;

  denom?: any;
}

// TODO: Handle the max block gas limit(?)
export const FeeInput: FunctionComponent<GasInputProps> = observer(
  ({
    feeConfig,
    label,
    className,
    defaultValue,
    gasConfig,
    gasPrice,
    decimals,
    denom
  }) => {
    const [inputId] = useState(() => {
      const bytes = new Uint8Array(4);
      crypto.getRandomValues(bytes);
      return `input-${Buffer.from(bytes).toString('hex')}`;
    });

    useEffect(() => {
      try {
        if (gasConfig.gasRaw !== 'NaN' && gasPrice != 'NaN') {
          feeConfig.setFee(
            new Big(parseInt(gasConfig.gasRaw)).mul(gasPrice).toFixed(decimals)
          );
        }
      } catch (error) {
        console.log(error);
      }
    }, [gasConfig.gasRaw, gasPrice]);

    return (
      <FormGroup className={className}>
        {label ? (
          <Label for={inputId} className="form-control-label">
            {label}
          </Label>
        ) : null}
        <InputEvm
          type="number"
          styleInputGroup={{
            boxShadow: '0 1px 3px rgb(50 50 93 / 15%), 0 1px 0 rgb(0 0 0 / 2%)'
          }}
          value={parseFloat(feeConfig.feeRaw)}
          style={{
            backgroundColor: 'rgba(230, 232, 236, 0.2)'
          }}
          onChange={(e) => {
            feeConfig.setFee(e.target.value);
            e.preventDefault()
          }}
          id={inputId}
          append={
            <span
              style={{
                padding: 10,
                color: '#777e90',
                textTransform: 'uppercase'
              }}
            >
              {denom?.feeCurrency?.coinDenom || 'ORAI'}
            </span>
          }
        />
        {/* <Input
          id={inputId}
          className="form-control-alternative"
          type="number"
          value={
            parseFloat(feeConfig.feeRaw).toString() +
            ' ' +
            denom?.feeCurrency?.coinDenom
          }
          onChange={(e) => {
            feeConfig.setFee(e.target.value);
            e.preventDefault();
          }}
          defaultValue={defaultValue}
          autoComplete="off"
        /> */}
      </FormGroup>
    );
  }
);
