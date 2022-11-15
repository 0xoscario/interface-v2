import React, { useState, useEffect } from 'react';
import { Box, useMediaQuery } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { ReactComponent as CloseIcon } from 'assets/images/CloseIcon.svg';
import { ReactComponent as HelpIcon } from 'assets/images/HelpIcon2.svg';
import Moonpay from 'assets/images/Moonpay.svg';
import Transak from 'assets/images/Transak.png';
import { CustomModal } from 'components';
import { useActiveWeb3React, useInitTransak } from 'hooks';
import 'components/styles/BuyFiatModal.scss';
import { useTranslation } from 'react-i18next';
import { CBPayInstanceType, initOnRamp } from '@coinbase/cbpay-js';

interface BuyFiatModalProps {
  open: boolean;
  onClose: () => void;
  buyMoonpay: () => void;
  buyBinance: () => void;
}

const BuyFiatModal: React.FC<BuyFiatModalProps> = ({
  open,
  onClose,
  buyMoonpay,
  buyBinance,
}) => {
  const { account } = useActiveWeb3React();
  const { breakpoints } = useTheme();
  const mobileWindowSize = useMediaQuery(breakpoints.down('sm'));
  const { initTransak } = useInitTransak();
  const { t } = useTranslation();
  const [
    onrampInstance,
    setOnrampInstance,
  ] = useState<CBPayInstanceType | null>();

  useEffect(() => {
    if (!account) return;
    initOnRamp(
      {
        appId: process.env.REACT_APP_COINBASE_APP_ID || '',
        widgetParameters: {
          destinationWallets: [
            {
              address: account,
              blockchains: ['polygon'],
            },
          ],
        },
        onSuccess: () => {
          console.log('success');
        },
        onExit: () => {
          console.log('exit');
        },
        onEvent: (event) => {
          console.log('event', event);
        },
        experienceLoggedIn: 'popup',
        experienceLoggedOut: 'popup',
        closeOnExit: true,
        closeOnSuccess: true,
      },
      (_, instance) => {
        setOnrampInstance(instance);
      },
    );

    return () => {
      onrampInstance?.destroy();
    };
  }, [account, onrampInstance]);

  const buyWithCoinbase = () => {
    onClose();
    onrampInstance?.open();
  };

  return (
    <CustomModal open={open} onClose={onClose}>
      <Box padding={3}>
        <Box className='flex justify-between items-center'>
          <h6>{t('fiatProviders')}</h6>
          <CloseIcon className='cursor-pointer' onClick={onClose} />
        </Box>
        <Box className='paymentBox'>
          <img src={Moonpay} alt='moonpay' />
          <Box className='buyButton' onClick={buyMoonpay}>
            {t('buy')}
          </Box>
        </Box>
        <Box className='paymentBox'>
          <img src={Transak} alt='transak' />
          <Box
            className='buyButton'
            onClick={() => {
              onClose();
              initTransak(account, mobileWindowSize);
            }}
          >
            {t('buy')}
          </Box>
        </Box>
        <Box className='paymentBox'>
          <h5>Binance Connect</h5>
          <Box className='buyButton' onClick={buyBinance}>
            {t('buy')}
          </Box>
        </Box>
        <Box className='paymentBox'>
          <h5>Coinbase</h5>
          <Box className='buyButton' onClick={buyWithCoinbase}>
            {t('buy')}
          </Box>
        </Box>
        <Box mt={3} display='flex'>
          <Box display='flex' mt={0.3}>
            <HelpIcon />
          </Box>
          <Box ml={1.5} width='calc(100% - 32px)'>
            <small>{t('fiatServiceDesc')}</small>
          </Box>
        </Box>
      </Box>
    </CustomModal>
  );
};

export default BuyFiatModal;
