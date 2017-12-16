import { connect } from 'react-redux';

import {
  currentSectorSelector,
  isSidebarEditActiveSelector,
} from 'store/selectors/base.selectors';
import {
  getCurrentEntity,
  getCurrentEntityType,
} from 'store/selectors/entity.selectors';

import { saveEntityEdit } from 'store/actions/entity.actions';
import {
  activateSidebarEdit,
  deactivateSidebarEdit,
} from 'store/actions/sidebar-edit.actions';
import EntityNavigation from './entity-navigation';

const mapStateToProps = state => ({
  isSaved: false,
  isSynced: !!state.user.model,
  isCloudSave: false,
  currentSector: currentSectorSelector(state),
  entity: getCurrentEntity(state),
  entityType: getCurrentEntityType(state),
  isSidebarEditActive: isSidebarEditActiveSelector(state),
});

export default connect(mapStateToProps, {
  activateSidebarEdit,
  deactivateSidebarEdit,
  saveEntityEdit,
})(EntityNavigation);
