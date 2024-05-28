
import { MenuOutlined } from '@ant-design/icons';
import React, { FC, useMemo } from 'react';

import { SchemaSettingOptions } from '../types';

export interface SchemaSettingsIconProps {
  options: SchemaSettingOptions;
}

export const SchemaSettingsIcon: FC<SchemaSettingOptions> = React.memo((props) => {
  const style = useMemo(() => ({ cursor: 'pointer', fontSize: 12 }), []);
  return <MenuOutlined role="button" style={style} />;
});
SchemaSettingsIcon.displayName = 'SchemaSettingsIcon';
