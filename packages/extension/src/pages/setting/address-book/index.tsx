import React, { FunctionComponent, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { HeaderLayout } from '../../../layouts';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import style from '../style.module.scss';
import {
  Button,
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalBody
} from 'reactstrap';
import styleAddressBook from './style.module.scss';
import { useStore } from '../../../stores';
import { PageButton } from '../page-button';
import { AddAddressModal } from './add-address-modal';
import { ExtensionKVStore, EthereumEndpoint } from '@owallet/common';
import { Bech32Address } from '@owallet/cosmos';
import { useConfirm } from '../../../components/confirm';
import {
  AddressBookSelectHandler,
  IIBCChannelConfig,
  useAddressBookConfig,
  useMemoConfig,
  useRecipientConfig
} from '@owallet/hooks';
import { Input } from '../../../components/form';

export const AddressBookPage: FunctionComponent<{
  onBackButton?: () => void;
  hideChainDropdown?: boolean;
  selectHandler?: AddressBookSelectHandler;
  ibcChannelConfig?: IIBCChannelConfig;
  isInTransaction?: boolean;
  isCloseIcon?: boolean;
}> = observer(
  ({
    onBackButton,
    hideChainDropdown,
    selectHandler,
    ibcChannelConfig,
    isCloseIcon
    //isInTransaction,
  }) => {
    const intl = useIntl();
    const history = useHistory();

    const { chainStore } = useStore();
    const current = chainStore.current;

    const [selectedChainId, setSelectedChainId] = useState(
      ibcChannelConfig?.channel
        ? ibcChannelConfig.channel.counterpartyChainId
        : current.chainId
    );

    const recipientConfig = useRecipientConfig(
      chainStore,
      selectedChainId,
      EthereumEndpoint
    );
    const memoConfig = useMemoConfig(chainStore, selectedChainId);

    const addressBookConfig = useAddressBookConfig(
      new ExtensionKVStore('address-book'),
      chainStore,
      selectedChainId,
      selectHandler
        ? selectHandler
        : {
            setRecipient: (): void => {
              // noop
            },
            setMemo: (): void => {
              // noop
            }
          }
    );

    const [dropdownOpen, setOpen] = useState(false);
    const toggle = () => setOpen(!dropdownOpen);

    const [addAddressModalOpen, setAddAddressModalOpen] = useState(false);
    const [addAddressModalIndex, setAddAddressModalIndex] = useState(-1);
    const [modalMore, setModalMore] = useState(false);
    const confirm = useConfirm();

    const addressBookIcons = (index: number, name?: string) => {
      return [
        // <img
        //   src={require('../../../public/assets/img/more-fill.svg')}
        //   onClick={(e) => {
        //     e.preventDefault();
        //     e.stopPropagation();
        //     // setAddAddressModalOpen(true);
        //     setModalMore(!modalMore);
        //     setAddAddressModalIndex(index);
        //   }}
        // />
        <i
          key="edit"
          className="fas fa-pen"
          style={{ cursor: 'pointer' }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            setAddAddressModalOpen(true);
            setAddAddressModalIndex(index);
          }}
        />,
        <i
          key="remove"
          className="fas fa-trash"
          style={{ cursor: 'pointer' }}
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (
              await confirm.confirm({
                styleYesBtn: {
                  background: '#EF466F'
                },
                styleModalBody: {
                  backgroundColor: '#353945'
                },
                styleNoBtn: {
                  backgroundColor: '#F8F8F9',
                  color: '#777E90'
                },
                yes: 'Delete',
                no: 'Cancel',
                title: name,
                paragraph: intl.formatMessage({
                  id: 'setting.address-book.confirm.delete-address.paragraph'
                })
              })
            ) {
              setAddAddressModalOpen(false);
              setAddAddressModalIndex(-1);
              await addressBookConfig.removeAddressBook(index);
            }
          }}
        />
      ];
    };

    return (
      <>
        {!isCloseIcon && (
          <div
            onClick={onBackButton}
            style={{
              cursor: 'pointer',
              textAlign: 'right'
            }}
          >
            <img
              src={require('../../../public/assets/img/close.svg')}
              alt="total-balance"
            />
          </div>
        )}
        <div className={styleAddressBook.container}>
          <div
            className={styleAddressBook.innerTopContainer}
            style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            {hideChainDropdown ? null : (
              <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
                <DropdownToggle
                  caret
                  style={{ boxShadow: 'none', paddingLeft: 0 }}
                >
                  {chainStore.getChain(selectedChainId).chainName}
                </DropdownToggle>
                <DropdownMenu>
                  {chainStore.chainInfos.map((chainInfo) => {
                    return (
                      <DropdownItem
                        key={chainInfo.chainId}
                        onClick={() => {
                          setSelectedChainId(chainInfo.chainId);
                        }}
                        className={styleAddressBook.chainItem}
                      >
                        {chainInfo.chainName}
                      </DropdownItem>
                    );
                  })}
                </DropdownMenu>
              </ButtonDropdown>
            )}
            <div className={styleAddressBook.addressBtnWrap}>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setAddAddressModalOpen(true);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
              >
                <img
                  src={require('../../../public/assets/svg/add-account.svg')}
                  alt=""
                  style={{ marginRight: 4 }}
                />
                <span>
                  <FormattedMessage id="setting.address-book.button.add" />
                </span>
              </div>
            </div>
          </div>
          {/* <div>
            <Input
              type={'text'}
              styleInputGroup={{
                display: 'flex',
                flexDirection: 'row-reverse'
              }}
              placeholder={'Search Name/Address'}
              append={
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 50
                  }}
                >
                  <img
                    src={require('../../../public/assets/img/light.svg')}
                    alt=""
                  />
                </div>
              }
            />
          </div> */}
          <div style={{ flex: '1 1 0', overflowY: 'auto' }}>
            {addressBookConfig.addressBookDatas.map((data, i) => {
              return (
                <PageButton
                  key={i.toString()}
                  title={data.name}
                  paragraph={
                    data.address.indexOf(
                      chainStore.getChain(selectedChainId).bech32Config
                        .bech32PrefixAccAddr
                    ) === 0
                      ? Bech32Address.shortenAddress(data.address, 34)
                      : data.address
                  }
                  subParagraph={data.memo}
                  icons={addressBookIcons(i, data.name)}
                  data-index={i}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    addressBookConfig.selectAddressAt(i);

                    if (onBackButton) {
                      onBackButton();
                    }
                  }}
                  style={{ cursor: selectHandler ? undefined : 'auto' }}
                />
              );
            })}
          </div>
        </div>
        {addAddressModalOpen ? (
          <>
            <hr
              className="my-3"
              style={{
                height: 1,
                borderTop: '1px solid #E6E8EC'
              }}
            />
            <AddAddressModal
              closeModal={() => {
                setAddAddressModalOpen(false);
                setAddAddressModalIndex(-1);
              }}
              recipientConfig={recipientConfig}
              memoConfig={memoConfig}
              addressBookConfig={addressBookConfig}
              index={addAddressModalIndex}
              chainId={selectedChainId}
            />
          </>
        ) : null}
      </>
    );
  }
);
