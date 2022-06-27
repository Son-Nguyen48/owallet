import React, { FunctionComponent, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import {
  EmptyAddressError,
  ENSFailedToFetchError,
  ENSIsFetchingError,
  ENSNotSupportedError,
  IMemoConfig,
  InvalidBech32Error,
  IRecipientConfig,
} from '@owallet/hooks';
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { TextInput } from './input';
import { ObservableEnsFetcher } from '@owallet/ens';
import { LoadingSpinner } from '../spinner';
import { useStyle } from '../../styles';
import { AddressBookIcon, NoteIcon } from '../icon';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSmartNavigation } from '../../navigation.provider';

const styles = StyleSheet.create({
  absolute: {
    position: 'absolute',
  },
  'height-16': {
    height: 16,
  },
  'justify-center': {
    justifyContent: 'center',
  },
  'margin-top-2': {
    marginTop: 2,
  },
  'margin-left-4': {
    marginLeft: 4,
  },
});

export const AddressInput: FunctionComponent<{
  labelStyle?: TextStyle;
  containerStyle?: ViewStyle;
  inputContainerStyle?: ViewStyle;
  errorLabelStyle?: TextStyle;

  label: string;

  recipientConfig: IRecipientConfig;
  memoConfig: IMemoConfig;

  disableAddressBook?: boolean;

  placeholder?: string;
  placeholderTextColor?: string;
}> = observer(
  ({
    labelStyle,
    containerStyle,
    inputContainerStyle,
    errorLabelStyle,
    label,
    recipientConfig,
    memoConfig,
    disableAddressBook,
    placeholder,
    placeholderTextColor,
  }) => {
    const smartNavigation = useSmartNavigation();

    const style = useStyle();

    const isENSAddress = ObservableEnsFetcher.isValidENS(
      recipientConfig.rawRecipient
    );

    const error = recipientConfig.getError();
    const errorText: string | undefined = useMemo(() => {
      if (error) {
        switch (error.constructor) {
          case EmptyAddressError:
            // No need to show the error to user.
            return;
          case InvalidBech32Error:
            return 'Invalid address';
          case ENSNotSupportedError:
            return 'ENS not supported';
          case ENSFailedToFetchError:
            return 'Failed to fetch the address from ENS';
          case ENSIsFetchingError:
            return;
          default:
            return 'Unknown error';
        }
      }
    }, [error]);

    const isENSLoading: boolean = error instanceof ENSIsFetchingError;

    return (
      <TextInput
        label={label}
        labelStyle={labelStyle}
        containerStyle={containerStyle}
        inputContainerStyle={inputContainerStyle}
        errorLabelStyle={errorLabelStyle}
        error={errorText}
        value={recipientConfig.rawRecipient}
        onChangeText={(text) => {
          recipientConfig.setRawRecipient(text);
        }}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        paragraph={
          isENSAddress ? (
            isENSLoading ? (
              <View>
                <View
                  style={[
                    styles['absolute'],
                    styles['height-16'],
                    styles['justify-center'],
                    styles['margin-top-2'],
                    styles['margin-left-4'],
                  ]}
                >
                  <LoadingSpinner
                    size={14}
                    color={"#83838F"}
                  />
                </View>
              </View>
            ) : (
              recipientConfig.recipient
            )
          ) : undefined
        }
        inputRight={
          disableAddressBook ? null : (
            <View
              style={style.flatten([
                'height-1',
                'overflow-visible',
                'justify-center',
              ])}
            >
              <TouchableOpacity
                style={style.flatten(['padding-4'])}
                onPress={() => {
                  smartNavigation.navigateSmart('AddressBook', {
                    recipientConfig,
                    memoConfig,
                  });
                }}
              >
                <NoteIcon
                  color={style.get('color-primary').color}
                  height={18}
                />
              </TouchableOpacity>
            </View>
          )
        }
        autoCorrect={false}
        autoCapitalize="none"
        autoCompleteType="off"
      />
    );
  }
);
