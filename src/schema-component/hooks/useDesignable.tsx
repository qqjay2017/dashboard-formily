

import { GeneralField, Query } from '@formily/core';
import { ISchema, Schema, SchemaOptionsContext, useField, useFieldSchema, useForm } from '@formily/react';
import { uid } from '@formily/shared';
import { message } from 'antd';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import set from 'lodash/set';
import React, { ComponentType, useCallback, useContext, useEffect, useMemo } from 'react';


import { SchemaComponentContext } from '../context';


// @ts-ignore
import clientPkg from '../../../package.json';
import { DashboardComponentContext } from '../../dashboard/context';
import { useDashboardRoot } from '../../dashboard';

interface CreateDesignableProps {
  current: Schema;
  model?: GeneralField;
  query?: Query;
  refresh?: () => void;
  onSuccess?: any;

  /**
   * NocoBase 系统版本
   */
  appVersion?: string;
}

export function createDesignable(options: CreateDesignableProps) {
  return new Designable(options);
}

type BreakFn = (s: ISchema) => boolean;

interface RemoveOptions {
  removeParentsIfNoChildren?: boolean;
  breakRemoveOn?: ISchema | BreakFn;
}

interface RecursiveRemoveOptions {
  breakRemoveOn?: ISchema | BreakFn;
}

const generateUid = (s: ISchema) => {
  if (!s['x-uid']) {
    s['x-uid'] = uid();
  }
  Object.keys(s.properties || {}).forEach((key) => {
    generateUid(s.properties[key]);
  });
};

const defaultWrap = (s: ISchema) => s;

const matchSchema = (source: ISchema, target: ISchema) => {
  if (!source || !target) {
    return;
  }
  for (const key in target) {
    if (Object.prototype.hasOwnProperty.call(target, key)) {
      const value = target[key];
      if (value !== source?.[key]) {
        return false;
      }
    }
  }
  return true;
};

export const splitWrapSchema = (wrapped: Schema, schema: ISchema) => {
  if (wrapped['x-uid'] && wrapped['x-uid'] === schema['x-uid']) {
    return [null, wrapped.toJSON()];
  }
  const wrappedJson: ISchema = wrapped.toJSON();
  const schema1 = { ...wrappedJson, properties: {} };
  let schema2 = null;
  const findSchema = (properties, parent) => {
    Object.keys(properties || {}).forEach((key) => {
      const current = properties[key];
      if (current['x-uid'] === schema['x-uid']) {
        schema2 = properties[key];
        return;
      } else {
        parent.properties[key] = { ...current, properties: {} };
        findSchema(current?.properties, parent.properties[key]);
      }
    });
  };
  findSchema(wrappedJson.properties, schema1);
  return [schema1, schema2];
};

const translate = (v?: any) => v;

export class Designable {
  current: Schema;
  options: CreateDesignableProps;
  /**
   * NocoBase 系统版本
   */
  appVersion: string;
  events = {};

  constructor(options: CreateDesignableProps) {
    this.options = options;
    this.current = options.current;
    this.appVersion = options.appVersion || '2.0';
  }

  get model() {
    return this.options.model;
  }

  get query() {
    return this.options.query;
  }

  loadAPIClientEvents() {
    this.on('patch', async ({ schema }) => {

      this.refresh()
    });
    this.on('batchPatch', async ({ schemas }) => {
      this.refresh();

    });
  }

  prepareProperty(schema: ISchema) {
    if (!schema.type) {
      schema.type = 'void';
    }
    if (!schema.name) {
      schema.name = uid();
    }
    // x-uid 仅用于后端查询 schema，如果 current 没有 x-uid 不处理
    if (!this.current['x-uid']) {
      return;
    }
    // if (Schema.isSchemaInstance(schema)) {
    //   return;
    // }
    generateUid(schema);
  }

  on(name: 'insertAdjacent' | 'remove' | 'error' | 'patch' | 'batchPatch', listener: any) {
    if (!this.events[name]) {
      this.events[name] = [];
    }
    this.events[name].push(listener);
  }

  async emit(name: 'insertAdjacent' | 'remove' | 'error' | 'patch' | 'batchPatch', ...args) {
    if (!this.events[name]) {
      return;
    }
    const [opts, ...others] = args;
    return Promise.all(this.events[name].map((fn) => fn.bind(this)({ current: this.current, ...opts }, ...others)));
  }

  parentsIn(schema: Schema) {
    if (!schema) {
      return false;
    }
    if (!Schema.isSchemaInstance(schema)) {
      return false;
    }
    let s = this.current;
    while (s?.parent) {
      if (s.parent === schema) {
        return true;
      }
      s = s.parent;
    }
    return false;
  }

  refresh() {
    const { refresh } = this.options;
    return refresh?.();
  }

  deepMerge(schema: ISchema) {
    const replaceKeys = {
      title: 'title',
      description: 'description',
      default: 'initialValue',
      readOnly: 'readOnly',
      writeOnly: 'editable',
      enum: 'dataSource',
      'x-pattern': 'pattern',
      'x-display': 'display',
      'x-validator': 'validator',
      'x-decorator': 'decorator',
      'x-component': 'component',
      'x-reactions': 'reactions',
      'x-content': 'content',
      'x-visible': 'visible',
      'x-hidden': 'hidden',
      'x-disabled': 'disabled',
      'x-editable': 'editable',
      'x-read-only': 'readOnly',
    };

    const mergeKeys = {
      'x-decorator-props': 'decoratorProps',
      'x-component-props': 'componentProps',
      'x-data': 'data',
    };

    Object.keys(schema).forEach((key) => {
      if (replaceKeys[key]) {
        this.current[key] = schema[key];
        this.updateModel(replaceKeys[key], schema[key]);
      } else if (mergeKeys[key]) {
        Object.keys(schema[key]).forEach((key2) => {
          set(this.current, [key, key2], schema[key][key2]);
          this.updateModel([mergeKeys[key], key2], schema[key][key2]);
        });
      } else {
        this.current[key] = schema[key];
      }
    });

    this.emit('patch', { schema });
  }

  getSchemaAttribute(key: string | string[], defaultValue?: any) {
    return get(this.current, key, defaultValue);
  }

  shallowMerge(schema: ISchema) {
    const replaceKeys = {
      title: 'title',
      description: 'description',
      default: 'initialValue',
      readOnly: 'readOnly',
      writeOnly: 'editable',
      enum: 'dataSource',
      'x-pattern': 'pattern',
      'x-display': 'display',
      'x-validator': 'validator',
      'x-decorator': 'decorator',
      'x-component': 'component',
      'x-reactions': 'reactions',
      'x-content': 'content',
      'x-visible': 'visible',
      'x-hidden': 'hidden',
      'x-disabled': 'disabled',
      'x-editable': 'editable',
      'x-read-only': 'readOnly',
      'x-decorator-props': 'decoratorProps',
      'x-component-props': 'componentProps',
      'x-data': 'data',
    };

    Object.keys(schema).forEach((key) => {
      this.current[key] = schema[key];
      if (replaceKeys[key]) {
        this.updateModel(replaceKeys[key], schema[key]);
      }
    });

    this.emit('patch', { schema });
  }

  updateModel(key: any, value: any) {
    const update = (field) => {
      set(field, key, value);
    };
    if (this.model) {
      update(this.model);
    }
    if (this.query) {
      this.query.take(update);
    }
  }


  remove(schema?: Schema, options: RemoveOptions = {}) {

    const s = schema || this.current;

    return this.emit('remove', {});
  }

  removeWithoutEmit(schema?: Schema, options: RemoveOptions = {}) {

    const s = schema || this.current;
    const removed = s.parent.removeProperty(s.name);

    return removed;
  }



}

export function useFindComponent() {
  const schemaOptions = useContext(SchemaOptionsContext);
  const components = useMemo(() => schemaOptions?.components || {}, [schemaOptions]);
  const find = (component: string | ComponentType) => {
    if (!component) {
      return null;
    }
    if (typeof component !== 'string') {
      return component;
    }
    const res = get(components, component);
    if (!res) {
      console.error(`[nocobase]: Component "${component}" not found`);
    }
    return res;
  };

  return find;
}


/**
 * 用法:
 *  const { patch } = useDesignable()
 * patch({
 * 
 * })
 * @returns 
 */
export function useDesignable() {


  const { designable, setDesignable, refresh } = useContext(DashboardComponentContext);
  const schemaOptions = useContext(SchemaOptionsContext);
  const components = useMemo(() => schemaOptions?.components || {}, [schemaOptions]);

  const DesignableBar = useMemo(
    () => () => {
      return <></>;
    },
    [],
  );
  const field = useField();
  const fieldSchema = useFieldSchema();


  const dn = useMemo(() => {
    return createDesignable({ refresh, current: fieldSchema, model: field, appVersion: clientPkg.version });
  }, [refresh, fieldSchema, field]);

  useEffect(() => {
    // TODO 将数据同步到后端
    dn.loadAPIClientEvents();
  }, [dn]);

  return {
    dn,
    designable,
    refresh,
    setDesignable,
    DesignableBar,
    findComponent: useCallback(
      (component: any) => {
        if (!component) {
          return null;
        }
        if (typeof component !== 'string') {
          return component;
        }
        return get(components, component);
      },
      [get],
    ),
    on: dn.on.bind(dn),
    // 修改当前组件的字段属性----核心函数
    patch: useCallback(
      (key: ISchema | string, value?: any) => {

        const update = (obj: any) => {
          Object.keys(obj).forEach((k) => {

            const val = obj[k];
            // TODO 更多key
            if (k === 'title') {
              field.title = val;
              fieldSchema['title'] = val;
            }
            if (k === 'x-decorator-props') {
              if (!field.decoratorProps) {
                field.decoratorProps = {};
              }
              if (!fieldSchema['x-decorator-props']) {
                fieldSchema['x-decorator-props'] = {};
              }
              Object.keys(val).forEach((i) => {
                field.decoratorProps[i] = val[i];
                fieldSchema['x-decorator-props'][i] = val[i];
              });
            }
            if (k === 'x-component-props') {
              if (!field.componentProps) {
                field.componentProps = {};
              }
              if (!fieldSchema['x-component-props']) {
                fieldSchema['x-component-props'] = {};
              }
              Object.keys(val).forEach((i) => {
                field.componentProps[i] = val[i];
                fieldSchema['x-component-props'][i] = val[i];
              });
            }
          });
        };
        if (typeof key === 'string') {
          const obj = {};
          set(obj, key, value);
          return update(obj);
        }
        update(key);
        // refresh();
      },
      [dn],
    ),
    shallowMerge: useCallback(
      (schema: ISchema) => {
        dn.shallowMerge(schema);
      },
      [dn],
    ),
    deepMerge: useCallback(
      (schema: ISchema) => {
        dn.deepMerge(schema);
      },
      [dn],
    ),
    remove: useCallback(
      (schema?: any, options?: RemoveOptions) => {
        dn.remove(schema, options);
      },
      [dn],
    ),



  };
}
