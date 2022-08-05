import React, { FunctionComponent } from 'react';
import { HeaderLayout } from '../../../../layouts';
import { useHistory } from 'react-router';
import { PageButton } from '../../page-button';

import style from './style.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../../stores';
import { Bech32Address } from '@owallet/cosmos';
import { useNotification } from '../../../../components/notification';
import { useConfirm } from '../../../../components/confirm';
import { CW20Currency, Secret20Currency } from '@owallet/types';
import { useIntl } from 'react-intl';

export const ManageTokenPage: FunctionComponent = observer(() => {
  const history = useHistory();
  const intl = useIntl();
  const notification = useNotification();
  const confirm = useConfirm();

  const { chainStore, tokensStore } = useStore();

  const isSecretWasm =
    chainStore.current.features &&
    chainStore.current.features.includes('secretwasm');

  const appCurrencies = chainStore.current.currencies.filter((currency) => {
    if (isSecretWasm) {
      return 'type' in currency && currency.type === 'secret20';
    } else {
      return 'type' in currency && currency.type === 'cw20';
    }
  });

  return (
    <>
      <div className={style.container}>
        {appCurrencies.map((currency) => {
          const cosmwasmToken = currency as CW20Currency | Secret20Currency;

          const icons: React.ReactElement[] = [];

          if ('viewingKey' in cosmwasmToken) {
            icons.push(
              <i
                key="copy"
                className="fas fa-copy"
                style={{
                  cursor: 'pointer'
                }}
                onClick={async (e) => {
                  e.preventDefault();

                  await navigator.clipboard.writeText(cosmwasmToken.viewingKey);
                  // TODO: Show success tooltip.
                  notification.push({
                    placement: 'top-center',
                    type: 'success',
                    duration: 2,
                    content: intl.formatMessage({
                      id: 'setting.token.manage.notification.viewing-key.copy'
                    }),
                    canDelete: true,
                    transition: {
                      duration: 0.25
                    }
                  });
                }}
              />
            );
          }

          /*
          icons.push(
            <i
              key="connections"
              className="fas fa-link"
              style={{
                cursor: "pointer",
              }}
              onClick={(e) => {
                e.preventDefault();

                history.push(
                  `/setting/connections/viewing-key/${currency.contractAddress}`
                );
              }}
            />
          );
           */

          icons.push(
            <i
              key="trash"
              className="fas fa-trash-alt"
              style={{
                cursor: 'pointer'
              }}
              onClick={async (e) => {
                e.preventDefault();

                if (
                  await confirm.confirm({
                    paragraph: intl.formatMessage({
                      id: 'setting.token.manage.confirm.remove-token'
                    }),
                    yes: 'Disable token',
                    no: 'Cancel',
                    styleYesBtn: {
                      background: 'transparent',
                      border: '1px solid #FF424F',
                      color: '#FF424F'
                    },
                    styleNoBtn: {
                      background: '#3B3B45',
                      color: '#F5F5FA'
                    }
                  })
                ) {
                  await tokensStore
                    .getTokensOf(chainStore.current.chainId)
                    .removeToken(cosmwasmToken);
                }
              }}
            />
          );

          return (
            <PageButton
              key={cosmwasmToken.contractAddress}
              style={{
                cursor: 'auto'
              }}
              title={cosmwasmToken.coinDenom}
              paragraph={Bech32Address.shortenAddress(
                cosmwasmToken.contractAddress,
                30
              )}
              icons={icons}
              styleTitle={{
                fontWeight: '400',
                fontSize: 14
              }}
              styleParagraph={{
                color: '#A6A6B0'
              }}
            />
          );
        })}
      </div>
    </>
  );
});
