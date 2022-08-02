import React, {
  FunctionComponent,
  ReactElement,
  useEffect,
  useState
} from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../stores';
import {
  StyleSheet,
  View,
  ViewStyle,
  Image,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { Text } from '@rneui/base';
import { CoinPretty } from '@owallet/unit';
import { useSmartNavigation } from '../../navigation.provider';
import { Currency } from '@owallet/types';
import { TokenSymbol } from '../../components/token-symbol';
import { DenomHelper, EthereumEndpoint } from '@owallet/common';
import { Bech32Address } from '@owallet/cosmos';
import { colors, metrics, spacing, typography } from '../../themes';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import {
  convertAmount,
  formatContractAddress,
  _keyExtract
} from '../../utils/helper';
import {
  QuantityIcon,
  SendIcon,
  TransactionMinusIcon
} from '../../components/icon';
import LinearGradient from 'react-native-linear-gradient';
import {
  BuyIcon,
  DepositIcon,
  SendDashboardIcon
} from '../../components/icon/button';
import {
  TransactionItem,
  TransactionSectionTitle
} from '../transactions/components';
import { PageWithScrollViewInBottomTabView } from '../../components/page';
import { API } from '../../common/api';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useSendTxConfig } from '@owallet/hooks';
import { Button } from '../../components/button';
import { TextInput } from '../../components/input';
import delay from 'delay';

const ORAI = 'oraichain-token';
const AIRI = 'airight';

const commonDenom = { ORAI, AIRI };

export const NftDetailScreen: FunctionComponent = observer(props => {
  const smartNavigation = useSmartNavigation();
  const { chainStore, accountStore, queriesStore, modalStore } = useStore();
  const route = useRoute<
    RouteProp<
      Record<
        string,
        {
          chainId?: string;
          currency?: string;
          recipient?: string;
        }
      >,
      string
    >
  >();
  const chainId = route?.params?.chainId
    ? route?.params?.chainId
    : chainStore?.current?.chainId;

  const account = accountStore.getAccount(chainId);
  const queries = queriesStore.get(chainId);

  const [address, setAddress] = useState('');
  const [quantity, setQuantity] = useState(1);

  const sendConfigs = useSendTxConfig(
    chainStore,
    chainId,
    account.msgOpts['send'],
    account.bech32Address,
    queries.queryBalances,
    EthereumEndpoint
  );

  const { item } = props.route?.params;

  useEffect(() => {
    // hard config to airight chain
    sendConfigs.amountConfig.setSendCurrency({
      coinDecimals: 6,
      type: 'cw20',
      coinMinimalDenom:
        'cw20:orai10ldgzued6zjp0mkqwsv2mux3ml50l97c74x8sg:aiRight Token',
      coinDenom: 'AIRI',
      coinGeckoId: 'airight',
      contractAddress: 'orai10ldgzued6zjp0mkqwsv2mux3ml50l97c74x8sg',
      coinImageUrl: 'https://i.ibb.co/m8mCyMr/airi.png'
    });
  }, []);

  const _onPressTransfer = async () => {
    modalStore.setOpen();
    modalStore.setChildren(
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{ paddingBottom: 70 }}>
          <View>
            <TextInput
              label="Destination address"
              onChange={({ nativeEvent: { eventCount, target, text } }) =>
                setAddress(text)
              }
              defaultValue={address}
            />
            {item.version === 1 ? null : (
              <TextInput
                label="Quantity"
                keyboardType="number-pad"
                onChangeText={txt => {
                  setQuantity(Number(txt));
                }}
                defaultValue={quantity.toString()}
              />
            )}
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly'
            }}
          >
            <Button
              text="Cancel"
              size="large"
              containerStyle={{
                width: '40%'
              }}
              style={{
                backgroundColor: colors['red-500']
              }}
              textStyle={{
                color: colors['white']
              }}
              underlayColor={colors['danger-400']}
              onPress={() => modalStore.close()}
            />
            <Button
              text="Confirm"
              containerStyle={{
                width: '40%'
              }}
              style={{
                backgroundColor: colors['purple-900']
              }}
              textStyle={{
                color: colors['white']
              }}
              underlayColor={colors['purple-400']}
              size="large"
              disabled={
                item.version === 1
                  ? address == ''
                  : address == '' || quantity == 0
              }
              // loading={signInteractionStore.isLoading}
              onPress={async () => {
                modalStore.close();
                await delay(600);
                _onPressBtnMain();
              }}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const _onPressBtnMain = async () => {
    if (account.isReadyToSendMsgs) {
      try {
        await account.sendToken(
          '0.000001', // amount not in use, but must have to send token fn work normally 'cause we use the same fn with send cw20 token
          sendConfigs.amountConfig.sendCurrency,
          sendConfigs.recipientConfig.recipient,
          sendConfigs.memoConfig.memo,
          { gas: '186415', amount: [{ amount: '0', denom: 'orai' }] }, // default fee and gas
          {
            preferNoSetFee: true,
            preferNoSetMemo: true
          },
          {
            onBroadcasted: txHash => {
              smartNavigation.pushSmart('TxPendingResult', {
                txHash: Buffer.from(txHash).toString('hex')
              });
            }
          },
          {
            contract_addr:
              item.version === 1
                ? 'orai1ase8wkkhczqdda83f0cd9lnuyvf47465j70hyk'
                : 'orai1c3phe2dcu852ypgvt0peqj8f5kx4x0s4zqcky4',
            recipient: address,
            to: address,
            token_id: item.id.toString(),
            amount: quantity.toString(),
            type: item.version === 1 ? '721' : '1155'
          }
        );
      } catch (e) {
        if (e?.message === 'Request rejected') {
          return;
        }
        if (e?.message.includes('Cannot read properties of undefined')) {
          return;
        }
        console.log('send error', e);
        if (smartNavigation.canGoBack) {
          smartNavigation.goBack();
        } else {
          smartNavigation.navigateSmart('Home', {});
        }
      }
    }
  };

  const [prices, setPrices] = useState({});

  useEffect(() => {
    (async function get() {
      try {
        const res = await API.get(
          `api/v3/simple/price?ids=${[ORAI, AIRI].join(',')}&vs_currencies=usd`,
          {
            baseURL: 'https://api.coingecko.com/'
          }
        );
        setPrices(res.data);
      } catch (error) {}
    })();
  }, []);

  return (
    <PageWithScrollViewInBottomTabView>
      <View style={styles.container}>
        <LinearGradient
          colors={['#161532', '#5E499A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            borderTopLeftRadius: spacing['11'],
            borderTopRightRadius: spacing['11'],
            borderBottomLeftRadius: spacing['11'],
            borderBottomRightRadius: spacing['11']
          }}
        >
          <View
            style={{
              marginTop: spacing['24'],
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Text
              style={{
                ...typography.h5,
                color: colors['white'],
                fontWeight: '700'
              }}
              numberOfLines={1}
            >
              {item.name}
            </Text>

            <Text
              style={{
                ...typography.h7,
                color: colors['purple-400'],
                fontWeight: '700'
              }}
            >
              {`#${item.id}`}
            </Text>
          </View>

          <View style={styles.containerImage}>
            <Image
              source={{
                uri: item.url
              }}
              style={{
                width: metrics.screenWidth - 110,
                height: metrics.screenWidth - 110,
                borderRadius: spacing['6']
              }}
              resizeMode="contain"
            />
            <View
              style={{
                marginTop: spacing['12'],
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
            >
              <View>
                <Text
                  style={{
                    ...typography.h6,
                    color: colors['gray-900'],
                    fontWeight: '700'
                  }}
                >
                  {item.version === 1
                    ? `${convertAmount(item.offer?.amount)} ${
                        item.offer?.denom ?? ''
                      }`
                    : `${convertAmount(item.offer?.lowestPrice)} ${
                        item.offer?.denom ?? ''
                      }`}
                </Text>

                <Text
                  style={{
                    ...typography.h7,
                    color: colors['gray-500'],
                    fontWeight: '700'
                  }}
                >{`$ ${
                  item.offer?.amount
                    ? item.offer.amount *
                      10 ** -6 *
                      prices[commonDenom[item.offer.denom]]?.usd
                    : 0
                }`}</Text>
              </View>

              <View style={styles.containerQuantity}>
                <View
                  style={{
                    marginTop: spacing['6']
                  }}
                >
                  <QuantityIcon size={24} color={colors['gray-150']} />
                </View>
                <Text
                  style={{
                    color: colors['gray-150']
                  }}
                >
                  {item.totalQuantity - item.availableQuantity}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.containerBtn}>
            {item.offer != null
              ? ['Transfer'].map((e, i) => (
                  <TouchableOpacity
                    style={{
                      ...styles.btn
                    }}
                    onPress={() => _onPressTransfer()}
                  >
                    <View style={{ ...styles.btnTransfer }}>
                      <SendDashboardIcon />
                      <Text
                        style={{
                          ...typography['h7'],
                          lineHeight: spacing['20'],
                          color: colors['white'],
                          paddingLeft: spacing['6'],
                          fontWeight: '700'
                        }}
                      >
                        {`Transfer`}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              : null}
          </View>
        </LinearGradient>
      </View>

      <View
        style={{
          backgroundColor: colors['white'],
          borderRadius: spacing['24'],
          paddingBottom: spacing['24'],
          height: metrics.screenHeight / 2
        }}
      >
        <TransactionSectionTitle title={'Transaction list'} />
        <FlatList
          data={[]}
          renderItem={({ item, index }) => (
            <TransactionItem item={item} key={index} address={''} />
          )}
          keyExtractor={_keyExtract}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() => (
            <View
              style={{
                height: 12
              }}
            />
          )}
          ListEmptyComponent={
            <View style={styles.transactionListEmpty}>
              <Image
                source={require('../../assets/image/not_found.png')}
                resizeMode="contain"
                height={142}
                width={142}
              />
              <Text
                style={{
                  ...typography.subtitle2,
                  color: colors['gray-300'],
                  marginTop: spacing['8']
                }}
              >
                {`No result found`}
              </Text>
            </View>
          }
        />

        {/* <TouchableOpacity
          style={{
            backgroundColor: colors['purple-900'],
            borderRadius: spacing['8'],
            marginHorizontal: spacing['24'],
            paddingVertical: spacing['16'],
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: spacing['12']
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <TransactionMinusIcon size={18} color={colors['white']} />
            <Text
              style={{
                ...typography.h6,
                color: colors['white'],
                fontWeight: '700',
                marginLeft: spacing['10']
              }}
            >
              View all transactions
            </Text>
          </View>
        </TouchableOpacity> */}
      </View>
    </PageWithScrollViewInBottomTabView>
  );
});

const styles = StyleSheet.create({
  container: {
    borderWidth: spacing['0.5'],
    borderColor: colors['gray-100'],
    borderRadius: spacing['12'],
    marginHorizontal: spacing['24'],
    marginVertical: spacing['12']
  },
  containerImage: {
    marginTop: spacing['8'],
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors['white'],
    marginHorizontal: 22,
    borderRadius: spacing['12'],
    padding: spacing['8'],
    marginBottom: spacing['24']
  },
  containerQuantity: {
    backgroundColor: colors['red-50'],
    borderRadius: spacing['6'],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50%'
  },
  containerBtn: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: spacing['6'],
    paddingLeft: spacing[22],
    paddingRight: spacing['22'],
    justifyContent: 'center',
    paddingBottom: spacing['24']
  },
  btn: {
    backgroundColor: colors['purple-900'],
    borderWidth: 0.5,
    borderRadius: spacing['8'],
    borderColor: colors['transparent'],
    marginLeft: 10,
    marginRight: 10
  },
  btnTransfer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing['6'],
    paddingBottom: spacing['6'],
    paddingLeft: spacing['12'],
    paddingRight: spacing['12']
  },
  transactionListEmpty: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});
