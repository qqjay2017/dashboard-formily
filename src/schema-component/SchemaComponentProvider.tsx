


/**
 * SchemaComponent运行的必要环境
 * @returns 
 */
import { createForm } from '@formily/core';
import { uid } from '@formily/shared';
import { FormProvider } from "@formily/react"
import { SchemaComponentProviderProps } from "./types"
import { useCallback, useMemo, useState } from "react";
import { SchemaComponentContext } from './context';
import { SchemaComponentOptions } from './SchemaComponentOptions';

export const SchemaComponentProvider = (props: SchemaComponentProviderProps) => {
    const [formId, setFormId] = useState(uid());
    const form = useMemo(() => props.form || createForm(), [formId]);
    const resetForm = useCallback(() => {
        setFormId(uid());
    }, []);
    return (
        <SchemaComponentContext.Provider value={{
            resetForm
        }}>
            <FormProvider form={form}>
                <SchemaComponentOptions inherit scope={props.scope} components={props.components}>
                    {props.children}
                </SchemaComponentOptions>
            </FormProvider>
        </SchemaComponentContext.Provider>
    )
}
