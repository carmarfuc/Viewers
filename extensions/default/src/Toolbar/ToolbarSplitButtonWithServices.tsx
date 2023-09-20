import { SplitButton, Icon, ToolbarButton } from '@ohif/ui';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

function ToolbarSplitButtonWithServices({
  isRadio,
  isAction,
  groupId,
  primary,
  secondary,
  items,
  renderer,
  onInteraction,
  servicesManager,
}) {
  const { toolbarService } = servicesManager?.services;

  const [buttonsState, setButtonState] = useState({
    primaryToolId: '',
    toggles: {},
    groups: {},
  });
  const { primaryToolId, toggles } = buttonsState;

  const isPrimaryToggle = primary.type === 'toggle';

  const isPrimaryActive =
    (primary.type === 'tool' && primaryToolId === primary.id) ||
    (isPrimaryToggle && toggles[primary.id] === true);

  const PrimaryButtonComponent =
    toolbarService?.getButtonComponentForUIType(primary.uiType) ?? ToolbarButton;

  useEffect(() => {
    const { unsubscribe } = toolbarService.subscribe(
      toolbarService.EVENTS.TOOL_BAR_STATE_MODIFIED,
      state => {
        setButtonState({ ...state });
      }
    );

    return () => {
      unsubscribe();
    };
  }, [toolbarService]);

  const DefaultListItemRenderer = ({ type, icon, label, t, id }) => {
    const isActive = type === 'toggle' && toggles[id] === true;

    return (
      <div
        className={classNames(
          'hover:bg-primary-dark flex h-8 w-full flex-row items-center p-3',
          'whitespace-pre text-base',
          isActive && 'bg-primary-dark',
          isActive
            ? 'text-[#348CFD]'
            : 'text-common-bright hover:bg-primary-dark hover:text-primary-light'
        )}
      >
        {icon && (
          <span className="mr-4">
            <Icon
              name={icon}
              className="h-5 w-5"
            />
          </span>
        )}
        <span className="mr-5">{t(label)}</span>
      </div>
    );
  };

  const listItemRenderer = renderer || DefaultListItemRenderer;

  return (
    <SplitButton
      isRadio={isRadio}
      isAction={isAction}
      primary={primary}
      secondary={secondary}
      items={items}
      groupId={groupId}
      renderer={listItemRenderer}
      isActive={isPrimaryActive}
      isToggle={isPrimaryToggle}
      onInteraction={onInteraction}
      Component={props => (
        <PrimaryButtonComponent
          {...props}
          servicesManager={servicesManager}
        />
      )}
    />
  );
}

ToolbarSplitButtonWithServices.propTypes = {
  isRadio: PropTypes.bool,
  isAction: PropTypes.bool,
  bState: PropTypes.shape({
    primaryToolId: PropTypes.string,
    toggles: PropTypes.object,
  }),
  groupId: PropTypes.string,
  primary: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['tool', 'action', 'toggle']).isRequired,
    uiType: PropTypes.string,
  }),
  secondary: PropTypes.shape({
    id: PropTypes.string,
    icon: PropTypes.string.isRequired,
    label: PropTypes.string,
    tooltip: PropTypes.string.isRequired,
    isActive: PropTypes.bool,
  }),
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['tool', 'action', 'toggle']).isRequired,
      icon: PropTypes.string,
      label: PropTypes.string,
      tooltip: PropTypes.string,
    })
  ),
  renderer: PropTypes.func,
  onInteraction: PropTypes.func.isRequired,
  servicesManager: PropTypes.shape({
    services: PropTypes.shape({
      toolbarService: PropTypes.object,
    }),
  }),
};

ToolbarSplitButtonWithServices.defaultProps = {
  isRadio: false,
  isAction: false,
};

export default ToolbarSplitButtonWithServices;