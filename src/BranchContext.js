import { createContext, useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { branchCodes, branchToId } from './utils';

const [defaultBranch] = branchCodes;

const defaultValue = {
  branch: defaultBranch,
  branchId: branchToId[defaultBranch],
};

export const Context = createContext(defaultValue);

export function useBranch() {
  return useContext(Context);
}

export function BranchProvider({ children }) {
  const { branch } = useParams();

  const value = useMemo(() => {
    const branchId = branchToId[branch];
    return { branch, branchId };
  }, [branch]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
