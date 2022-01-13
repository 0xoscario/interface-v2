import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useActiveWeb3React } from 'hooks';
import { AppDispatch, AppState } from 'state';
import {
  addPopup,
  ApplicationModal,
  PopupContent,
  removePopup,
  setOpenModal,
  updateEthPrice,
  updateGlobalData,
  updateGlobalChartData,
  updateTopTokens,
  updateTokenPairs,
  updateSwapTokenPrice0,
  updateSwapTokenPrice1,
  addBookMarkToken,
  removeBookmarkToken,
  updateBookmarkTokens,
  updateTopPairs,
  addBookMarkPair,
  removeBookmarkPair,
  updateAnalyticToken,
  updateTokenChartData,
} from './actions';

export function useBlockNumber(): number | undefined {
  const { chainId } = useActiveWeb3React();

  return useSelector(
    (state: AppState) => state.application.blockNumber[chainId ?? -1],
  );
}

export function useModalOpen(modal: ApplicationModal): boolean {
  const openModal = useSelector(
    (state: AppState) => state.application.openModal,
  );
  return openModal === modal;
}

export function useToggleModal(modal: ApplicationModal): () => void {
  const open = useModalOpen(modal);
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(() => dispatch(setOpenModal(open ? null : modal)), [
    dispatch,
    modal,
    open,
  ]);
}

export function useOpenModal(modal: ApplicationModal): () => void {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(() => dispatch(setOpenModal(modal)), [dispatch, modal]);
}

export function useCloseModals(): () => void {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(() => dispatch(setOpenModal(null)), [dispatch]);
}

export function useWalletModalToggle(): () => void {
  return useToggleModal(ApplicationModal.WALLET);
}

export function useToggleSettingsMenu(): () => void {
  return useToggleModal(ApplicationModal.SETTINGS);
}

export function useShowClaimPopup(): boolean {
  return useModalOpen(ApplicationModal.CLAIM_POPUP);
}

export function useToggleShowClaimPopup(): () => void {
  return useToggleModal(ApplicationModal.CLAIM_POPUP);
}

export function useToggleSelfClaimModal(): () => void {
  return useToggleModal(ApplicationModal.SELF_CLAIM);
}

// returns a function that allows adding a popup
export function useAddPopup(): (
  content: PopupContent,
  key?: string,
  removeAfterMs?: number | null,
) => void {
  const dispatch = useDispatch();

  return useCallback(
    (content: PopupContent, key?: string, removeAfterMs?: number | null) => {
      dispatch(addPopup({ content, key, removeAfterMs }));
    },
    [dispatch],
  );
}

// returns a function that allows removing a popup via its key
export function useRemovePopup(): (key: string) => void {
  const dispatch = useDispatch();
  return useCallback(
    (key: string) => {
      dispatch(removePopup({ key }));
    },
    [dispatch],
  );
}

// get the list of active popups
export function useActivePopups(): AppState['application']['popupList'] {
  const list = useSelector((state: AppState) => state.application.popupList);
  return useMemo(() => list.filter((item) => item.show), [list]);
}

export function useEthPrice(): {
  ethPrice: any;
  updateEthPrice: ({ price, oneDayPrice, ethPriceChange }: any) => void;
} {
  const ethPrice = useSelector((state: AppState) => state.application.ethPrice);
  const dispatch = useDispatch();
  const _updateETHPrice = useCallback(
    ({ price, oneDayPrice, ethPriceChange }) => {
      dispatch(updateEthPrice({ price, oneDayPrice, ethPriceChange }));
    },
    [dispatch],
  );
  return { ethPrice, updateEthPrice: _updateETHPrice };
}

export function useGlobalData(): {
  globalData: any;
  updateGlobalData: ({ data }: any) => void;
} {
  const globalData = useSelector(
    (state: AppState) => state.application.globalData,
  );
  const dispatch = useDispatch();
  const _updateGlobalData = useCallback(
    ({ data }) => {
      dispatch(updateGlobalData({ data }));
    },
    [dispatch],
  );
  return { globalData, updateGlobalData: _updateGlobalData };
}

export function useGlobalChartData(): {
  globalChartData: any;
  updateGlobalChartData: (data: any) => void;
} {
  const globalChartData = useSelector(
    (state: AppState) => state.application.globalChartData,
  );
  const dispatch = useDispatch();
  const _updateGlobalChartData = useCallback(
    (data) => {
      dispatch(updateGlobalChartData(data));
    },
    [dispatch],
  );
  return { globalChartData, updateGlobalChartData: _updateGlobalChartData };
}

export function useTopTokens(): {
  topTokens: any;
  updateTopTokens: (data: any) => void;
} {
  const topTokens = useSelector(
    (state: AppState) => state.application.topTokens,
  );
  const dispatch = useDispatch();
  const _updateTopTokens = useCallback(
    (data) => {
      dispatch(updateTopTokens(data));
    },
    [dispatch],
  );
  return { topTokens, updateTopTokens: _updateTopTokens };
}

export function useBookmarkTokens(): {
  bookmarkTokens: string[];
  addBookmarkToken: (data: string) => void;
  removeBookmarkToken: (data: string) => void;
  updateBookmarkTokens: (data: string[]) => void;
} {
  const bookmarkedTokens = useSelector(
    (state: AppState) => state.application.bookmarkedTokens,
  );
  const dispatch = useDispatch();
  const _addBookmarkToken = useCallback(
    (token: string) => {
      dispatch(addBookMarkToken(token));
    },
    [dispatch],
  );
  const _removeBookmarkToken = useCallback(
    (token: string) => {
      dispatch(removeBookmarkToken(token));
    },
    [dispatch],
  );
  const _updateBookmarkTokens = useCallback(
    (tokens: string[]) => {
      dispatch(updateBookmarkTokens(tokens));
    },
    [dispatch],
  );
  return {
    bookmarkTokens: bookmarkedTokens,
    addBookmarkToken: _addBookmarkToken,
    removeBookmarkToken: _removeBookmarkToken,
    updateBookmarkTokens: _updateBookmarkTokens,
  };
}

export function useBookmarkPairs(): {
  bookmarkPairs: string[];
  addBookmarkPair: (data: string) => void;
  removeBookmarkPair: (data: string) => void;
  updateBookmarkPairs: (data: string[]) => void;
} {
  const bookmarkedPairs = useSelector(
    (state: AppState) => state.application.bookmarkedPairs,
  );
  const dispatch = useDispatch();
  const _addBookmarkPair = useCallback(
    (pair: string) => {
      dispatch(addBookMarkPair(pair));
    },
    [dispatch],
  );
  const _removeBookmarkPair = useCallback(
    (pair: string) => {
      dispatch(removeBookmarkPair(pair));
    },
    [dispatch],
  );
  const _updateBookmarkPairs = useCallback(
    (pairs: string[]) => {
      dispatch(updateBookmarkTokens(pairs));
    },
    [dispatch],
  );
  return {
    bookmarkPairs: bookmarkedPairs,
    addBookmarkPair: _addBookmarkPair,
    removeBookmarkPair: _removeBookmarkPair,
    updateBookmarkPairs: _updateBookmarkPairs,
  };
}

export function useTokenPairs(): {
  tokenPairs: any;
  updateTokenPairs: ({ data }: any) => void;
} {
  const tokenPairs = useSelector(
    (state: AppState) => state.application.tokenPairs,
  );
  const dispatch = useDispatch();
  const _updateTokenPairs = useCallback(
    ({ data }) => {
      dispatch(updateTokenPairs({ data }));
    },
    [dispatch],
  );
  return { tokenPairs, updateTokenPairs: _updateTokenPairs };
}

export function useSwapTokenPrice0(): {
  swapTokenPrice0: any;
  updateSwapTokenPrice0: (data: any) => void;
} {
  const swapTokenPrice0 = useSelector(
    (state: AppState) => state.application.swapTokenPrice0,
  );
  const dispatch = useDispatch();
  const _updateSwapTokenPrice0 = useCallback(
    (data) => {
      dispatch(updateSwapTokenPrice0(data));
    },
    [dispatch],
  );
  return { swapTokenPrice0, updateSwapTokenPrice0: _updateSwapTokenPrice0 };
}

export function useSwapTokenPrice1(): {
  swapTokenPrice1: any;
  updateSwapTokenPrice1: (data: any) => void;
} {
  const swapTokenPrice1 = useSelector(
    (state: AppState) => state.application.swapTokenPrice1,
  );
  const dispatch = useDispatch();
  const _updateSwapTokenPrice1 = useCallback(
    (data) => {
      dispatch(updateSwapTokenPrice1(data));
    },
    [dispatch],
  );
  return { swapTokenPrice1, updateSwapTokenPrice1: _updateSwapTokenPrice1 };
}

export function useTopPairs(): {
  topPairs: any;
  updateTopPairs: (data: any) => void;
} {
  const topPairs = useSelector((state: AppState) => state.application.topPairs);
  const dispatch = useDispatch();
  const _updateTopPairs = useCallback(
    (data) => {
      dispatch(updateTopPairs(data));
    },
    [dispatch],
  );
  return { topPairs, updateTopPairs: _updateTopPairs };
}

export function useAnalyticToken(): {
  analyticToken: any;
  updateAnalyticToken: (data: any) => void;
} {
  const analyticToken = useSelector(
    (state: AppState) => state.application.analyticToken,
  );
  const dispatch = useDispatch();
  const _updateAnalyticToken = useCallback(
    (data) => {
      dispatch(updateAnalyticToken(data));
    },
    [dispatch],
  );
  return { analyticToken, updateAnalyticToken: _updateAnalyticToken };
}

export function useTokenChartData(): {
  tokenChartData: any;
  updateTokenChartData: (data: any) => void;
} {
  const tokenChartData = useSelector(
    (state: AppState) => state.application.tokenChartData,
  );
  const dispatch = useDispatch();
  const _updateTokenChartData = useCallback(
    (data) => {
      dispatch(updateTokenChartData(data));
    },
    [dispatch],
  );
  return { tokenChartData, updateTokenChartData: _updateTokenChartData };
}
