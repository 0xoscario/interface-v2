import { GlobalConst } from 'constants/index';
import { createReducer } from '@reduxjs/toolkit';
import { updateVersion } from 'state/global/actions';
import {
  addSerializedPair,
  addSerializedToken,
  removeSerializedPair,
  removeSerializedToken,
  SerializedPair,
  SerializedToken,
  updateMatchesDarkMode,
  updateUserDarkMode,
  updateUserExpertMode,
  updateUserSlippageTolerance,
  updateUserDeadline,
  toggleURLWarning,
  updateUserSingleHopOnly,
  updateUserBonusRouter,
  updateSlippageManuallySet,
  updateUserSlippageAuto,
  updateUserLiquidityHub,
  updateUserZapSlippage,
  updateIsInfiniteApproval,
  updateUserAmlScore,
} from './actions';

const currentTimestamp = () => new Date().getTime();
export const INITIAL_ZAP_SLIPPAGE = 100;
export const SLIPPAGE_DEFAULT = 50;

export interface UserState {
  // the timestamp of the last updateVersion action
  lastUpdateVersionTimestamp?: number;

  userDarkMode: boolean | null; // the user's choice for dark mode or light mode
  matchesDarkMode: boolean; // whether the dark mode media query matches

  userExpertMode: boolean;
  userBonusRouterDisabled: boolean;

  // user defined slippage tolerance in bips, used in all txns
  userSlippageTolerance: number;
  userSlippageAuto: boolean;
  slippageManuallySet: boolean;
  userLiquidityHubDisabled: boolean;

  // deadline set by user in minutes, used in all txns
  userDeadline: number;

  tokens: {
    [chainId: number]: {
      [address: string]: SerializedToken;
    };
  };

  pairs: {
    [chainId: number]: {
      // keyed by token0Address:token1Address
      [key: string]: SerializedPair;
    };
  };

  timestamp: number;
  URLWarningVisible: boolean;
  // v3 user states
  userSingleHopOnly: boolean; // only allow swaps on direct pairs
  userZapSlippage: number;
  isInfiniteApproval: boolean;

  amlScore: number;
}

function pairKey(token0Address: string, token1Address: string) {
  return `${token0Address};${token1Address}`;
}

export const initialState: UserState = {
  userDarkMode: null,
  matchesDarkMode: false,
  userExpertMode: false,
  userBonusRouterDisabled: false,
  userSlippageTolerance: GlobalConst.utils.INITIAL_ALLOWED_SLIPPAGE,
  userSlippageAuto: false,
  slippageManuallySet: false,
  userLiquidityHubDisabled: false,
  userDeadline: GlobalConst.utils.DEFAULT_DEADLINE_FROM_NOW,
  tokens: {},
  pairs: {},
  timestamp: currentTimestamp(),
  URLWarningVisible: true,
  userSingleHopOnly: false,
  userZapSlippage: INITIAL_ZAP_SLIPPAGE,
  isInfiniteApproval: false,
  amlScore: 0,
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateVersion, (state) => {
      // slippage isnt being tracked in local storage, reset to default
      // noinspection SuspiciousTypeOfGuard
      if (typeof state.userSlippageTolerance !== 'number') {
        state.userSlippageTolerance =
          GlobalConst.utils.INITIAL_ALLOWED_SLIPPAGE;
      }

      // deadline isnt being tracked in local storage, reset to default
      // noinspection SuspiciousTypeOfGuard
      if (typeof state.userDeadline !== 'number') {
        state.userDeadline = GlobalConst.utils.DEFAULT_DEADLINE_FROM_NOW;
      }

      state.lastUpdateVersionTimestamp = currentTimestamp();
    })
    .addCase(updateUserDarkMode, (state, action) => {
      state.userDarkMode = action.payload.userDarkMode;
      state.timestamp = currentTimestamp();
    })
    .addCase(updateMatchesDarkMode, (state, action) => {
      state.matchesDarkMode = action.payload.matchesDarkMode;
      state.timestamp = currentTimestamp();
    })
    .addCase(updateUserExpertMode, (state, action) => {
      state.userExpertMode = action.payload.userExpertMode;
      state.timestamp = currentTimestamp();
    })
    .addCase(updateUserSlippageTolerance, (state, action) => {
      state.userSlippageTolerance = action.payload.userSlippageTolerance;
      state.timestamp = currentTimestamp();
    })
    .addCase(updateUserDeadline, (state, action) => {
      state.userDeadline = action.payload.userDeadline;
      state.timestamp = currentTimestamp();
    })
    .addCase(addSerializedToken, (state, { payload: { serializedToken } }) => {
      state.tokens[serializedToken.chainId] =
        state.tokens[serializedToken.chainId] || {};
      state.tokens[serializedToken.chainId][
        serializedToken.address
      ] = serializedToken;
      state.timestamp = currentTimestamp();
    })
    .addCase(
      removeSerializedToken,
      (state, { payload: { address, chainId } }) => {
        state.tokens[chainId] = state.tokens[chainId] || {};
        delete state.tokens[chainId][address];
        state.timestamp = currentTimestamp();
      },
    )
    .addCase(addSerializedPair, (state, { payload: { serializedPair } }) => {
      if (
        serializedPair.token0.chainId === serializedPair.token1.chainId &&
        serializedPair.token0.address !== serializedPair.token1.address
      ) {
        const chainId = serializedPair.token0.chainId;
        state.pairs[chainId] = state.pairs[chainId] || {};
        state.pairs[chainId][
          pairKey(serializedPair.token0.address, serializedPair.token1.address)
        ] = serializedPair;
      }
      state.timestamp = currentTimestamp();
    })
    .addCase(
      removeSerializedPair,
      (state, { payload: { chainId, tokenAAddress, tokenBAddress } }) => {
        if (state.pairs[chainId]) {
          // just delete both keys if either exists
          delete state.pairs[chainId][pairKey(tokenAAddress, tokenBAddress)];
          delete state.pairs[chainId][pairKey(tokenBAddress, tokenAAddress)];
        }
        state.timestamp = currentTimestamp();
      },
    )
    .addCase(toggleURLWarning, (state) => {
      state.URLWarningVisible = !state.URLWarningVisible;
    })
    .addCase(updateUserSingleHopOnly, (state, action) => {
      state.userSingleHopOnly = action.payload.userSingleHopOnly;
    })
    .addCase(updateUserBonusRouter, (state, action) => {
      state.userBonusRouterDisabled = action.payload.userBonusRouterDisabled;
    })
    .addCase(updateUserSlippageAuto, (state, action) => {
      state.userSlippageAuto = action.payload.userSlippageAuto;
    })

    .addCase(updateSlippageManuallySet, (state, action) => {
      state.slippageManuallySet = action.payload.slippageManuallySet;
    })
    .addCase(updateUserLiquidityHub, (state, action) => {
      state.userLiquidityHubDisabled = action.payload.userLiquidityHubDisabled;
    })
    .addCase(updateUserZapSlippage, (state, action) => {
      state.userZapSlippage = action.payload.userZapSlippage;
    })
    .addCase(updateIsInfiniteApproval, (state, action) => {
      state.isInfiniteApproval = action.payload.isInfiniteApproval;
    })
    .addCase(updateUserAmlScore, (state, action) => {
      state.amlScore = action.payload.score;
    }),
);
