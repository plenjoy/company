import * as settingActions from './settingActions';
import * as propertyActions from './propertyActions';
import * as elementArrayActions from './elementArrayActions';
// import * as pageArrayActions from './pageArrayActions';
import * as projectActions from './projectActions';
import * as orderInfoActions from './orderInfoActions';
// import * as calendarSettingActions from './calendarSettingActions';
import * as imageArrayActions from './imageArrayActions';
import * as coverActions from './coverActions';

export default {
  ...settingActions,
  ...propertyActions,
  ...elementArrayActions,
  // ...pageArrayActions,
  ...projectActions,
  ...orderInfoActions,
  ...coverActions,
  // ...calendarSettingActions,
  ...imageArrayActions
};
