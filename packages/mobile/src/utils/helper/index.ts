import { navigate } from '../../router/root';
import isValidDomain from 'is-valid-domain';
import { find } from 'lodash';
import moment from 'moment';
const SCHEME_IOS = 'owallet://open_url?url=';
const SCHEME_ANDROID = 'app.owallet.oauth://google/open_url?url=';

export const handleDeepLink = async ({ url }) => {
  if (url) {
    const path = url.replace(SCHEME_ANDROID, '').replace(SCHEME_IOS, '');
    if (!url.indexOf(SCHEME_ANDROID)) {
      navigate('Browser', { path });
    }

    if (url.indexOf(SCHEME_IOS) === 0) {
      navigate('Browser', { path });
    }
  }
};

export const checkValidDomain = (url: string) => {
  if (isValidDomain(url)) {
    return true;
  }
  // try with URL
  try {
    const { origin } = new URL(url);
    return origin.length > 0;
  } catch {
    return false;
  }
};

export const _keyExtract = (item, index) => index.toString();

export const formatContractAddress = (address: string) => {
  const fristLetter = address.slice(0, 10);
  const lastLetter = address.slice(-5);

  return `${fristLetter}...${lastLetter}`;
};

// capital first letter of string
export const capitalizedText = (text: string) => {
  return text.slice(0, 1).toUpperCase() + text.slice(1, text.length);
};

export const TRANSACTION_TYPE = {
  DELEGATE: 'MsgDelegate',
  UNDELEGATE: 'MsgUndelegate',
  CLAIM_REWARD: 'MsgWithdrawDelegationReward',
  WITHDRAW: 'MsgWithdrawDelegatorReward',
  SEND: 'MsgSend',
  INSTANTIATE_CONTRACT: 'MsgInstantiateContract',
  EXECUTE_CONTRACT: 'MsgExecuteContract'
};

export const getTransactionValue = ({ data, address, logs }) => {
  const transactionType = data?.[0]?.type;
  let valueAmount = data?.[0]?.value?.amount;
  const events = logs?.[0]?.events;
  let eventType = null;
  let unbond = null;
  let isRecipient = false;
  if (
    checkType(transactionType, TRANSACTION_TYPE.CLAIM_REWARD) ||
    checkType(transactionType, TRANSACTION_TYPE.WITHDRAW)
  ) {
    eventType = 'withdraw_rewards';
  }
  if (checkType(transactionType, TRANSACTION_TYPE.DELEGATE)) {
    eventType = 'delegate';
  }
  if (
    checkType(transactionType, TRANSACTION_TYPE.SEND) ||
    checkType(transactionType, TRANSACTION_TYPE.UNDELEGATE)
  ) {
    eventType = 'transfer';
  }
  if (events && eventType) {
    const value = find(events, { type: eventType });
    if (checkType(transactionType, TRANSACTION_TYPE.UNDELEGATE)) {
      unbond = getUnbondInfo(logs?.[0]?.events);
    }

    const amountReward = value && find(value?.attributes, { key: 'amount' });
    const recipient = value && find(value?.attributes, { key: 'recipient' });
    if (recipient?.value === address) {
      isRecipient = true;
    }
    valueAmount = {
      // eslint-disable-next-line no-useless-escape
      amount: amountReward?.value?.replace(/[^0-9\.]+/g, ''),
      denom: amountReward?.value?.replace(/^\d+/g, '') || 'orai'
    };
  }

  const amount = valueAmount?.amount || valueAmount?.[0]?.amount || 0;
  const denom = valueAmount?.denom || valueAmount?.[0]?.denom;
  let title, isPlus;

  switch (true) {
    case checkType(transactionType, TRANSACTION_TYPE.DELEGATE):
      title = 'Delegated';

      isPlus = false;
      break;

    case checkType(transactionType, TRANSACTION_TYPE.UNDELEGATE):
      title = 'Un-Delegated';

      isPlus = true;
      break;

    case checkType(transactionType, TRANSACTION_TYPE.CLAIM_REWARD):
    case checkType(transactionType, TRANSACTION_TYPE.WITHDRAW):
      title = 'Reward';

      isPlus = true;
      break;

    case checkType(transactionType, TRANSACTION_TYPE.SEND): {
      title = 'Send Token';

      if (isRecipient) {
        title = 'Received Token';

        isPlus = true;
      }
      break;
    }

    case checkType(transactionType, TRANSACTION_TYPE.EXECUTE_CONTRACT): {
      title = 'Execute Contract';

      if (isRecipient) {
        title = 'Execute Contract';

        isPlus = true;
      }
      break;
    }

    case checkType(transactionType, TRANSACTION_TYPE.INSTANTIATE_CONTRACT): {
      title = 'Instantiate Contract';

      break;
    }
    default:
      break;
  }

  return { title, isPlus, amount, denom, unbond };
};

export const checkType = (str, type) => str?.indexOf?.(type) >= 0;

export const getUnbondInfo = (events = []) => {
  const unbond = find(events, { type: 'unbond' });
  const unbondValue = find(unbond.attributes, { key: 'amount' });
  const unbondCompleted = find(unbond.attributes, {
    key: 'completion_time'
  });

  const date = moment(unbondCompleted.value);
  const isCompleted = moment(date).isBefore(moment());

  return {
    isCompleted,
    date,
    value: unbondValue?.value
  };
};
