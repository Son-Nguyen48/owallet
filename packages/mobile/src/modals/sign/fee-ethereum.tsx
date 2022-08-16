import { IFeeEthereumConfig, IGasConfig } from '@owallet/hooks';
import React, { FunctionComponent, useState, useEffect } from 'react';
import { View } from 'react-native';
import { TextStyle, ViewStyle } from 'react-native';
import { TextInput } from '../../components/input';
import Big from 'big.js';

export const FeeInput: FunctionComponent<{
  labelStyle?: TextStyle;
  containerStyle?: ViewStyle;
  inputContainerStyle?: ViewStyle;
  gasConfig: IGasConfig;
  gasPrice: string;
  label: string;
  feeConfig: IFeeEthereumConfig;
  decimals: number;
}> = ({
  labelStyle,
  containerStyle,
  inputContainerStyle,
  label,
  feeConfig,
  gasConfig,
  gasPrice,
  decimals
}) => {
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
    <TextInput
      labelStyle={labelStyle}
      containerStyle={containerStyle}
      inputContainerStyle={inputContainerStyle}
      label={label}
      value={parseFloat(feeConfig.feeRaw).toString()}
      onChangeText={text => {
        feeConfig.setFee(text);
      }}
      keyboardType="number-pad"
    />
  );
};

export const GasInput: FunctionComponent<{
  labelStyle?: TextStyle;
  containerStyle?: ViewStyle;
  inputContainerStyle?: ViewStyle;

  label: string;

  gasConfig: IGasConfig;
}> = ({
  labelStyle,
  containerStyle,
  inputContainerStyle,
  label,
  gasConfig
}) => {
  return (
    <TextInput
      labelStyle={labelStyle}
      containerStyle={containerStyle}
      inputContainerStyle={inputContainerStyle}
      label={label}
      value={gasConfig.gasRaw}
      onChangeText={text => {
        gasConfig.setGas(text);
      }}
      keyboardType="number-pad"
    />
  );
};

export const FeeEthereumInSign: FunctionComponent<{
  feeConfig: IFeeEthereumConfig;
  gasConfig: IGasConfig;
  gasPrice: string;
  decimals: number;
}> = ({ feeConfig, gasConfig, gasPrice, decimals }) => {
  return (
    <View>
      <GasInput label={'Gas'} gasConfig={gasConfig} />
      <FeeInput
        label={'Fee'}
        feeConfig={feeConfig}
        gasPrice={gasPrice}
        gasConfig={gasConfig}
        decimals={decimals}
      />
    </View>
  );
};
