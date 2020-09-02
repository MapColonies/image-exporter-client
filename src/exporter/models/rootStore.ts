import { types, Instance, getEnv, onAction } from 'mobx-state-tree';
import { useContext, createContext } from 'react';
import { ResponseState } from '../../common/models/ResponseState';
// import { conflictStore, ConflictResponse } from './conflictStore';
import { exporterStore, ExporterResponse } from './exporterStore';

type FetchAction = (
  url: string,
  params: Record<string, unknown>
) => Promise<ExporterResponse>;

export const baseRootStore = types
  .model({
    exporterStore: types.optional(exporterStore, {
      state: ResponseState.PENDING,
      searchParams: {},
    }),
    // mapStore: types.optional(ConflictMapState, {})
  })
  .views((self) => ({
    get fetch(): FetchAction {
      const env: { fetch: FetchAction } = getEnv(self);
      return env.fetch;
    },
  }));

export const rootStore = baseRootStore.actions((self) => ({
  afterCreate(): void {
    // self.exporterStore.fetchConflicts().catch(console.error);

    // onAction(
    //   self,
    //   (call) => {
    //     if (call.name === 'setItemsPerPage' || call.name === 'setPage') {
    //       self.exporterStore.fetchConflicts().catch(console.error);
    //     }
    //   },
    //   true
    // );
  },
}));
export interface IBaseRootStore extends Instance<typeof baseRootStore> {}
export interface IRootStore extends Instance<typeof rootStore> {}
const rootStoreContext = createContext<null | IRootStore | IBaseRootStore>(
  null
);

export const StoreProvider = rootStoreContext.Provider;
export const useStore = (): IRootStore | IBaseRootStore => {
  const store = useContext(rootStoreContext);
  if (store === null) {
    throw new Error('Store cannot be null, please add a context provider');
  }
  return store;
};