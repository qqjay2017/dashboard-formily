

import { filter, isArray, isEmpty } from 'lodash-es';

/**
 * 通过 targetKey 判断关系字段的数据是否为空
 * @param value
 * @param targetKey
 * @returns
 */
export const isFieldValueEmpty = (value, targetKey) => {
  if (isArray(value)) {
    return isEmpty(filter(value, (v) => v?.[targetKey] != null));
  }
  return value?.[targetKey] == null;
};

export const isDisplayField = (schemaName: string) => {
  return schemaName.includes('.');
};
