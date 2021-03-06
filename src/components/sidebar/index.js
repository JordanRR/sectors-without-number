import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import {
  getCurrentEntity,
  getCurrentEntityType,
  getCurrentEntityChildren,
} from 'store/selectors/entity.selectors';
import { isSidebarEditActiveSelector } from 'store/selectors/base.selectors';

import { deleteEntity } from 'store/actions/entity.actions';

import Sidebar from './sidebar';

const mapStateToProps = state => ({
  entity: getCurrentEntity(state),
  entityType: getCurrentEntityType(state),
  entityChildren: getCurrentEntityChildren(state),
  isSidebarEditActive: isSidebarEditActiveSelector(state),
});

const mapDispatchToProps = (dispatch, props) => ({
  deleteEntity: () => dispatch(deleteEntity(props.intl)),
});

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(Sidebar),
);
