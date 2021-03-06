import { omitBy, includes } from 'lodash';
import { createSelector } from 'reselect';

import {
  currentSectorSelector,
  sectorSelector,
  savedSectorSelector,
  shareSectorSelector,
} from 'store/selectors/base.selectors';

export const getUserSectors = createSelector(
  [sectorSelector, savedSectorSelector],
  (sectors, saved) =>
    omitBy(
      sectors,
      (sector, key) => sector.isCloudSave || !includes(saved, key),
    ),
);

export const isCurrentSectorSaved = createSelector(
  [currentSectorSelector, savedSectorSelector],
  (currentSector, saved) => includes(saved, currentSector),
);

export const isViewingSharedSector = createSelector(
  [currentSectorSelector, shareSectorSelector],
  (currentSector, share) => currentSector === share,
);
