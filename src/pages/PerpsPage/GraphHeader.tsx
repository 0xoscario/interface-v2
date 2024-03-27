import React, { useState, useEffect, useMemo } from 'react';
import { useMarketsStream } from '@orderly.network/hooks';
import { Close, KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import { Box, Popover } from '@material-ui/core';
import { formatNumber } from 'utils';
import { SearchInput } from 'components';

interface MarketData {
  symbol: string;
  index_price: number;
  mark_price: number;
  sum_unitary_funding: number;
  est_funding_rate: number;
  last_funding_rate: number;
  next_funding_time: number;
  open_interest: number;
  '24h_open': number;
  '24h_close': number;
  '24h_high': number;
  '24h_low': number;
  '24h_volume': number;
  '24h_amount': number;
  '24h_volumn': number;
  change: number;
}

interface Props {
  setTokenName: (token: string) => void;
}

export const GraphHeader: React.FC<Props> = ({ setTokenName }) => {
  const { data } = useMarketsStream();
  const [tokenSymbol, setTokenSymbol] = useState<string | null>();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const handleTokenSelect = (token: any) => {
    setTokenSymbol(token.symbol);
    setTokenName(token.symbol);
    handleClose();
  };

  useEffect(() => {
    setTokenSymbol('PERP_ETH_USDC');
  }, []);

  const token: any = data?.find((item) => item.symbol === tokenSymbol);
  const [search, setSearch] = useState('');

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((item) =>
      item.symbol.toLowerCase().includes(search.toLowerCase()),
    );
  }, [data, search]);

  return (
    <Box className='flex items-center' height='48px' gridGap={12}>
      <Box className='perpsTokenSelect' onClick={handleClick} gridGap={8}>
        <p>{token ? token.symbol : 'Tokens'}</p>
        {open ? (
          <KeyboardArrowUp className='text-secondary' />
        ) : (
          <KeyboardArrowDown className='text-secondary' />
        )}
      </Box>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box padding={2}>
          <Box className='flex items-center' gridGap={16}>
            <SearchInput
              placeholder='Search'
              value={search}
              setValue={setSearch}
            />
            <Close
              className='cursor-pointer text-secondary'
              onClick={handleClose}
            />
          </Box>
          <table className='perpsTokenSearchTable'>
            <thead>
              <tr>
                <th align='left'>
                  <span className='text-secondary'>Instrument</span>
                </th>
                <th align='right'>
                  <span className='text-secondary'>Last</span>
                </th>
                <th align='right'>
                  <span className='text-secondary'>24h%</span>
                </th>
                <th align='right'>
                  <span className='text-secondary'>Volume</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item: any, index) => (
                  <tr key={index} onClick={() => handleTokenSelect(item)}>
                    <td align='left'>
                      <small>{item.symbol}</small>
                    </td>
                    <td align='right'>
                      <small>{item?.index_price}</small>
                    </td>
                    <td align='right'>
                      <small
                        className={
                          Number(item?.change) < 0
                            ? 'text-error'
                            : 'text-success'
                        }
                      >
                        {formatNumber(item?.change)}
                      </small>
                    </td>
                    <td align='right'>
                      <small>{item?.['24h_volume']}</small>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    style={{ textAlign: 'center', verticalAlign: 'middle' }}
                  >
                    <small>No data available</small>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Box>
      </Popover>

      {/* Render Token Info */}
      <p>{token?.mark_price}</p>
      {/* Additional Flex Columns */}
      <Box>
        <p className='span text-secondary'>24h Change</p>
        <p
          className={`span weight-500 ${
            (token?.change ?? 0) < 0 ? 'text-error' : 'text-success'
          }`}
        >
          {formatNumber(token?.change)}
        </p>
      </Box>
      <Box>
        <p className='span text-secondary'>Mark</p>
        <p className='span'>{token?.mark_price}</p>
      </Box>
      <Box>
        <p className='span text-secondary'>Index</p>
        <p className='span'>{token?.index_price}</p>
      </Box>
      <Box>
        <p className='span text-secondary'>24h Volume</p>
        <p className='span'>{token?.['24h_volume']}</p>
      </Box>
      <Box>
        <p className='span text-secondary'>Funding Rate</p>
        <p className='span'>{token?.est_funding_rate}</p>
      </Box>
      <Box>
        <p className='span text-secondary'>Open Interest</p>
        <p className='span'>{token?.open_interest}</p>
      </Box>
    </Box>
  );
};