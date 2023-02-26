import React from 'react';
import { Box, Button } from '@material-ui/core';
import { useActiveWeb3React } from 'hooks';
import Loader from 'components/Loader';
import { useWalletModalToggle } from 'state/application/hooks';
import { useTranslation } from 'react-i18next';
import GammaLPList from './GammaLPList';
import { useQuery } from 'react-query';
import { GammaPairs } from 'constants/index';
import { getGammaPositions } from 'utils';

export default function MyLiquidityPoolsV3() {
  const { t } = useTranslation();
  const { account } = useActiveWeb3React();

  const showConnectAWallet = Boolean(!account);

  const toggleWalletModal = useWalletModalToggle();

  const fetchGammaPositions = async () => {
    if (!account) return;
    const gammaPositions = await getGammaPositions(account);
    return gammaPositions;
  };

  const { isLoading: positionsLoading, data: gammaPositions } = useQuery(
    'fetchGammaPositions',
    fetchGammaPositions,
    {
      refetchInterval: 30000,
    },
  );

  const gammaPositionList = gammaPositions
    ? Object.keys(gammaPositions).filter(
        (value) =>
          !!Object.values(GammaPairs).find(
            (pairData) =>
              !!pairData.find(
                (item) => item.address.toLowerCase() === value.toLowerCase(),
              ),
          ),
      )
    : [];

  return (
    <Box>
      <p className='weight-600'>{t('myGammaLP')}</p>
      <>
        {positionsLoading ? (
          <Box mt={2} className='flex justify-center'>
            <Loader stroke='white' size={'2rem'} />
          </Box>
        ) : gammaPositions && gammaPositionList.length > 0 ? (
          <GammaLPList
            gammaPairs={gammaPositionList}
            gammaPositions={gammaPositions}
          />
        ) : (
          <Box mt={2} textAlign='center'>
            <p>{t('noLiquidityPositions')}.</p>
            {showConnectAWallet && (
              <Box maxWidth={250} margin='20px auto 0'>
                <Button fullWidth onClick={toggleWalletModal}>
                  {t('connectWallet')}
                </Button>
              </Box>
            )}
          </Box>
        )}
      </>
    </Box>
  );
}
