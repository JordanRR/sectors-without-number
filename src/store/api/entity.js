import { firestore as Firestore } from 'firebase';
import { omit, size, values, map, forEach, flatten, includes } from 'lodash';

import Entities from 'constants/entities';

export const uploadEntities = (entities, uid, sectorId) => {
  if (!sectorId && !size(entities[Entities.sector.key])) {
    throw new Error(
      'To save entities a new sector must exist or an existing sector should be given',
    );
  }

  const allKeys = flatten(values(map(entities, Object.keys)));
  const keyMapping = {};
  const batches = [Firestore().batch()];
  let batchCount = 0;
  let batchIndex = 0;

  const saveEntityTree = (parentId, newParentId, thisSectorId) => {
    forEach(entities, (entityTypes, entityType) =>
      forEach(entityTypes, (entity, oldId) => {
        if (
          parentId !== entity.parent &&
          (parentId || includes(allKeys, entity.parent))
        ) {
          return Promise.resolve();
        }

        const timestamp = Firestore.FieldValue.serverTimestamp();
        const savableEntity = {
          ...entity,
          creator: uid,
          created: timestamp,
          updated: timestamp,
        };
        if (newParentId) {
          savableEntity.parent = newParentId;
          savableEntity.sector = thisSectorId;
        }
        const newRef = Firestore()
          .collection('entities')
          .doc(entityType)
          .collection('entity')
          .doc();
        batches[batchIndex].set(newRef, savableEntity);
        batchCount += 1;
        if (batchCount === 500) {
          batches.push(Firestore().batch());
          batchIndex += 1;
          batchCount = 0;
        }
        keyMapping[oldId] = newRef.id;
        let savableSectorId = thisSectorId || sectorId;
        if (entityType === Entities.sector.key) {
          savableSectorId = newRef.id;
        }
        return saveEntityTree(oldId, newRef.id, savableSectorId);
      }),
    );
  };

  saveEntityTree();

  return Promise.all(batches.map(batch => batch.commit())).then(() => ({
    mapping: keyMapping,
  }));
};

export const getSyncedSectors = uid =>
  Firestore()
    .collection('entities')
    .doc(Entities.sector.key)
    .collection('entity')
    .where('creator', '==', uid)
    .get()
    .then(typeSnapshot => {
      let sectors = {};
      typeSnapshot.forEach(doc => {
        sectors = {
          ...sectors,
          [doc.id]: doc.data(),
        };
      });
      return sectors;
    });

export const getSectorEntities = (sectorId, uid) => {
  let entities = {};
  return Firestore()
    .collection('entities')
    .doc(Entities.sector.key)
    .collection('entity')
    .doc(sectorId)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return { entities };
      }
      const data = doc.data();
      entities[Entities.sector.key] = {
        [doc.id]: data,
      };
      return Promise.all(
        map(omit(Entities, Entities.sector.key), ({ key }) =>
          Firestore()
            .collection('entities')
            .doc(key)
            .collection('entity')
            .where('sector', '==', sectorId)
            .get()
            .then(typeSnapshot => {
              typeSnapshot.forEach(typeDoc => {
                entities = {
                  ...entities,
                  [key]: {
                    ...entities[key],
                    [typeDoc.id]: typeDoc.data(),
                  },
                };
              });
            }),
        ),
      ).then(() => ({
        entities,
        sectorId,
        share: data.creator !== uid ? sectorId : undefined,
      }));
    });
};

export const updateEntities = entities => {
  const batch = Firestore().batch();
  forEach(entities, (entityUpdates, entityType) =>
    forEach(entityUpdates, (update, entityId) =>
      batch.update(
        Firestore()
          .collection('entities')
          .doc(entityType)
          .collection('entity')
          .doc(entityId),
        {
          ...update,
          updated: Firestore.FieldValue.serverTimestamp(),
        },
      ),
    ),
  );
  return batch.commit();
};

export const deleteEntities = entities => {
  const oldSectorBatch = Firestore().batch();
  const batches = [Firestore().batch()];
  let batchCount = 0;
  let batchIndex = 0;
  const promises = [];
  forEach(entities, (entityIds, entityType) =>
    entityIds.forEach(entityId => {
      if (entityType === Entities.sector.key) {
        promises.push(
          Firestore()
            .collection('sectors')
            .doc(entityId)
            .get()
            .then(doc => {
              if (doc.exists) {
                oldSectorBatch.delete(
                  Firestore()
                    .collection('sectors')
                    .doc(entityId),
                );
              }
            }),
        );
      }
      batches[batchIndex].delete(
        Firestore()
          .collection('entities')
          .doc(entityType)
          .collection('entity')
          .doc(entityId),
      );
      batchCount += 1;
      if (batchCount === 500) {
        batches.push(Firestore().batch());
        batchIndex += 1;
        batchCount = 0;
      }
    }),
  );
  return Promise.all(promises).then(() =>
    Promise.all([
      ...batches.map(batch => batch.commit()),
      oldSectorBatch.commit(),
    ]),
  );
};
