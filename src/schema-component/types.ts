import { Form } from '@formily/core';
import { SchemaReactComponents } from '@formily/react';
import { PropsWithChildren } from 'react';

export interface SchemaComponentProviderProps {
    designable?: boolean;
    onDesignableChange?: (value: boolean) => void;
    form?: Form;
    scope?: Record<string, any>;
    components?: SchemaReactComponents;
    children?: React.ReactNode;
}

export interface SchemaComponentContextValue {
    resetForm?: () => void;
    refresh?: () => void;
    distributed?: boolean;
    designable?: boolean;
    scope?: any;
    components?: any;
    setDesignable?: (flag?: boolean) => void
}

export interface SchemaComponentOptionsProps extends PropsWithChildren {
    scope?: any;
    components?: SchemaReactComponents;
    inherit?: boolean;
}


export interface ISchemaComponentProvider {
    designable?: boolean;
    onDesignableChange?: (value: boolean) => void;
    form?: Form;
    scope?: any;
    components?: SchemaReactComponents;
    children?: React.ReactNode;
}