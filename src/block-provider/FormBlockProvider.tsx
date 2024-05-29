
import React, { createContext, useContext, useEffect, useMemo, useRef } from 'react';

export const FormBlockContext = createContext<{
  form?: any;
  type?: 'update' | 'create';
  action?: string;
  field?: any;
  service?: any;
  resource?: any;
  updateAssociationValues?: any;
  formBlockRef?: any;
  collectionName?: string;
  params?: any;

  [key: string]: any;
}>({});
FormBlockContext.displayName = 'FormBlockContext';



/**
 * @internal
 * @returns
 */
export const useFormBlockContext = () => {
  return useContext(FormBlockContext);
};