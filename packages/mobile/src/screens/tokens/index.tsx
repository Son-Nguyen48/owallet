import React, { FunctionComponent } from 'react';
import { PageWithScrollView } from '../../components/page';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../stores';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { CoinPretty } from '@owallet/unit';
import { useStyle } from '../../styles';
import { useSmartNavigation } from '../../navigation';
import { RightArrowIcon } from '../../components/icon';
import { Card } from '../../components/card';
import { RectButton } from '../../components/rect-button';
import { Currency } from '@owallet/types';
import { TokenSymbol } from '../../components/token-symbol';
import { DenomHelper } from '@owallet/common';
import { Bech32Address } from '@owallet/cosmos';

export const TokensScreen: FunctionComponent = observer(() => {
  const { chainStore, queriesStore, accountStore } = useStore();

  const style = useStyle();

  const queryBalances = queriesStore
    .get(chainStore.current.chainId)
    .queryBalances.getQueryBech32Address(
      accountStore.getAccount(chainStore.current.chainId).bech32Address
    );

  const tokens = queryBalances.positiveNativeUnstakables
    .concat(queryBalances.nonNativeBalances)
    .sort((a, b) => {
      const aDecIsZero = a.balance.toDec().isZero();
      const bDecIsZero = b.balance.toDec().isZero();

      if (aDecIsZero && !bDecIsZero) {
        return 1;
      }
      if (!aDecIsZero && bDecIsZero) {
        return -1;
      }

      return a.currency.coinDenom < b.currency.coinDenom ? -1 : 1;
    });

  return (
    <PageWithScrollView>
      <Card style={style.flatten(['padding-bottom-14'])}>
        {tokens.map((token) => {
          return (
            <TokenItem
              key={token.currency.coinMinimalDenom}
              chainInfo={{ stakeCurrency: chainStore.current.stakeCurrency }}
              balance={token.balance}
            />
          );
        })}
      </Card>
    </PageWithScrollView>
  );
});

export const TokenItem: FunctionComponent<{
  containerStyle?: ViewStyle;

  chainInfo: {
    stakeCurrency: Currency;
  };
  balance: CoinPretty;
}> = ({ containerStyle, chainInfo, balance }) => {
  const style = useStyle();

  const smartNavigation = useSmartNavigation();

  // The IBC currency could have long denom (with the origin chain/channel information).
  // Because it is shown in the title, there is no need to show such long denom twice in the actual balance.
  let balanceCoinDenom: string;
  let name = balance.currency.coinDenom;

  if ('originCurrency' in balance.currency && balance.currency.originCurrency) {
    balanceCoinDenom = balance.currency.originCurrency.coinDenom;
  } else {
    const denomHelper = new DenomHelper(balance.currency.coinMinimalDenom);
    balanceCoinDenom = balance.currency.coinDenom;
    if (denomHelper.contractAddress) {
      name += ` (${Bech32Address.shortenAddress(
        denomHelper.contractAddress,
        24
      )})`;
    }
  }

  return (
    <RectButton
      style={StyleSheet.flatten([
        style.flatten([
          'flex-row',
          'items-center',
          'padding-x-card-horizontal',
          'padding-y-14'
        ]),
        containerStyle
      ])}
      onPress={() => {
        smartNavigation.navigateSmart('Send', {
          currency: balance.currency.coinMinimalDenom
        });
      }}
    >
      <TokenSymbol
        style={style.flatten(['margin-right-12'])}
        size={44}
        chainInfo={chainInfo}
        currency={balance.currency}
      />
      <View>
        <Text
          style={style.flatten([
            'subtitle3',
            'color-text-black-low',
            'margin-bottom-4'
            // 'uppercase'
          ])}
        >
          {name}
        </Text>
        <Text
          style={style.flatten([
            'h5',
            'color-text-black-medium',
            'max-width-300'
          ])}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {`${balance
            .trim(true)
            .shrink(true)
            .maxDecimals(6)
            .upperCase(true)
            .hideDenom(true)
            .toString()} ${balanceCoinDenom}`}
        </Text>
      </View>
      <View style={style.get('flex-1')} />
      <RightArrowIcon
        height={16}
        color={style.get('color-text-black-very-very-low').color}
      />
    </RectButton>
  );
};
