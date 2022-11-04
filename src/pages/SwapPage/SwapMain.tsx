import React, { useEffect, useState } from 'react';
import { Box } from '@material-ui/core';
import { ReactComponent as SettingsIcon } from 'assets/images/SettingsIcon.svg';
import { useIsProMode, useIsV3 } from 'state/application/hooks';
import { Swap, SettingsModal, ToggleSwitch } from 'components';
import {
  GelatoLimitOrderPanel,
  GelatoLimitOrdersHistoryPanel,
} from '@gelatonetwork/limit-orders-react';
import { Trans, useTranslation } from 'react-i18next';
import { SwapBestTrade } from 'components/Swap';
import SwapV3Page from './V3/Swap';
import { useParams } from 'react-router-dom';
import { getConfig } from '../../config/index';
import { useActiveWeb3React } from 'hooks';

const SWAP_BEST_TRADE = 0;
const SWAP_NORMAL = 1;
const SWAP_V3 = 2;
const SWAP_LIMIT = 3;

const SwapMain: React.FC = () => {
  const [swapIndex, setSwapIndex] = useState(SWAP_BEST_TRADE);
  const [openSettingsModal, setOpenSettingsModal] = useState(false);
  const { isProMode, updateIsProMode } = useIsProMode();
  const { chainId } = useActiveWeb3React();

  const { updateIsV3 } = useIsV3();
  const params: any = useParams();
  const isOnV3 = params ? params.version === 'v3' : false;
  const isOnV2 = params ? params.version === 'v2' : false;

  const { t } = useTranslation();
  const config = getConfig(chainId);
  const v2 = config['v2'];
  const v3 = config['v3'];
  const showBestTrade = config['swap']['bestTrade'];
  const showProMode = config['swap']['proMode'];
  const showLimitOrder = config['swap']['limitOrder'];

  useEffect(() => {
    updateIsV3(isOnV3);
    if (isOnV3) {
      setSwapIndex(SWAP_V3);
    } else if (isOnV2) {
      setSwapIndex(SWAP_NORMAL);
    }

    if (!showBestTrade) {
      const tradeIndex = v2 ? SWAP_NORMAL : SWAP_V3;
      setSwapIndex(tradeIndex);
      if (tradeIndex === SWAP_V3) {
        updateIsV3(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnV3, showBestTrade, isOnV2]);

  return (
    <>
      {openSettingsModal && (
        <SettingsModal
          open={openSettingsModal}
          onClose={() => setOpenSettingsModal(false)}
        />
      )}
      <Box
        className={`flex flex-wrap items-center justify-between ${
          isProMode ? ' proModeWrapper' : ''
        }`}
      >
        <Box display='flex' width={1}>
          {showBestTrade && (
            <Box
              //TODO: Active class resolution should come from from a func
              className={`${
                swapIndex === SWAP_BEST_TRADE ? 'activeSwap' : ''
              } swapItem headingItem
              `}
              onClick={() => {
                updateIsV3(false);
                setSwapIndex(SWAP_BEST_TRADE);
              }}
            >
              <p>{t('bestTrade')}</p>
            </Box>
          )}
          {v2 && (
            <Box
              className={`${
                swapIndex === SWAP_NORMAL ? 'activeSwap' : ''
              } swapItem headingItem
              `}
              onClick={() => {
                updateIsV3(false);
                setSwapIndex(SWAP_NORMAL);
              }}
            >
              <p>{t('market')}</p>
            </Box>
          )}
          {v3 && (
            <Box
              className={`${
                swapIndex === SWAP_V3 ? 'activeSwap' : ''
              } swapItem headingItem
              `}
              onClick={() => {
                updateIsV3(true);
                setSwapIndex(SWAP_V3);
              }}
            >
              <p>{t('marketV3')}</p>
            </Box>
          )}
          {showLimitOrder && (
            <Box
              className={`${
                swapIndex === SWAP_LIMIT ? 'activeSwap' : ''
              } swapItem headingItem`}
              onClick={() => {
                updateIsV3(false);
                setSwapIndex(SWAP_LIMIT);
              }}
            >
              <p>{t('limit')}</p>
            </Box>
          )}
        </Box>
        {!isProMode && showProMode && (
          <Box margin='8px 16px 0' className='flex items-center'>
            <Box className='flex items-center' mr={1}>
              <span
                className='text-secondary text-uppercase'
                style={{ marginRight: 8 }}
              >
                {t('proMode')}
              </span>
              <ToggleSwitch
                toggled={false}
                onToggle={() => {
                  updateIsProMode(true);
                }}
              />
            </Box>
            <Box className='headingItem'>
              <SettingsIcon onClick={() => setOpenSettingsModal(true)} />
            </Box>
          </Box>
        )}
      </Box>
      <Box padding={isProMode ? '0 24px' : '0'} mt={3.5}>
        {swapIndex === SWAP_BEST_TRADE && <SwapBestTrade />}
        {swapIndex === SWAP_NORMAL && <Swap />}
        {swapIndex === SWAP_V3 && <SwapV3Page />}
        {swapIndex === SWAP_LIMIT && (
          <Box className='limitOrderPanel'>
            <GelatoLimitOrderPanel />
            <GelatoLimitOrdersHistoryPanel />
            <Box mt={2} textAlign='center'>
              <small>
                <Trans
                  i18nKey='limitOrderDisclaimer'
                  components={{
                    bold: <b />,
                    alink: (
                      <a
                        target='_blank'
                        rel='noopener noreferrer'
                        href='https://www.certik.org/projects/gelato'
                      />
                    ),
                  }}
                />
              </small>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

export default SwapMain;
