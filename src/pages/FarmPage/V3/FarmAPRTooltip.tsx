import React from 'react';
import { V3Farm } from './Farms';
import { CustomTooltip } from 'components';
import { Box } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

export const FarmAPRTooltip: React.FC<{ farms: V3Farm[]; children: any }> = ({
  farms,
  children,
}) => {
  const { t } = useTranslation();
  return (
    <CustomTooltip
      padding='0'
      placement='right'
      color='#12131a'
      title={
        <Box className='farmAPRTooltipWrapper'>
          {farms.map((farm, ind) => (
            <Box key={ind}>
              <Box className='flex' gridGap={8}>
                <Box className='farmTypeWrapper'>{farm.type}</Box>
              </Box>
              <small>{t('totalAPR')}</small>
            </Box>
          ))}
        </Box>
      }
    >
      {children}
    </CustomTooltip>
  );
};
