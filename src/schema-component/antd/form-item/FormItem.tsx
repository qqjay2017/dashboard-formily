

import { css, cx } from '@emotion/css';
import { IFormItemProps, FormItem as Item } from '@formily/antd-v5';
import { Field } from '@formily/core';
import { observer, useField, useFieldSchema } from '@formily/react';
import React, { useEffect, useMemo } from 'react';

import { HTMLEncode } from '../input/shared';


// import useLazyLoadDisplayAssociationFieldsOfForm from './hooks/useLazyLoadDisplayAssociationFieldsOfForm';
// import useParseDefaultValue from './hooks/useParseDefaultValue';
import { useFormActiveFields } from '../../../block-provider';

Item.displayName = 'FormilyFormItem';

const formItemWrapCss = css`
  & .ant-space {
    flex-wrap: wrap;
  }
`;

const formItemLabelCss = css`
  > .ant-formily-item-label {
    display: none;
  }
`;

export const FormItem: any = observer((props: IFormItemProps) => {
  // useEnsureOperatorsValid();
  const field = useField<Field>();
  const schema = useFieldSchema();
  // const contextVariable = useContextVariable();
  // const variables = useVariables();
  const { addActiveFieldName } = useFormActiveFields() || {};

  // useEffect(() => {
  //   variables?.registerVariable(contextVariable);
  // }, [contextVariable]);

  // 需要放在注冊完变量之后
  // useParseDefaultValue();
  // useLazyLoadDisplayAssociationFieldsOfForm();

  useEffect(() => {
    addActiveFieldName?.(schema.name as string);
  }, [addActiveFieldName, schema.name]);

  const showTitle = schema['x-decorator-props']?.showTitle ?? true;
  const extra = useMemo(() => {
    return typeof field.description === 'string' ? (
      <div
        dangerouslySetInnerHTML={{
          __html: HTMLEncode(field.description).split('\n').join('<br/>'),
        }}
      />
    ) : (
      field.description
    );
  }, [field.description]);
  const className = useMemo(() => {
    return cx(formItemWrapCss, {
      [formItemLabelCss]: showTitle === false,
    });
  }, [showTitle]);

  return (
    <Item className={className} {...props} extra={extra} />
  )
}, { displayName: 'FormItem' })




