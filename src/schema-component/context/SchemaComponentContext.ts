
import { createContext } from 'react';
import { SchemaComponentContextValue } from '../types';


export const SchemaComponentContext = createContext<SchemaComponentContextValue>({});
SchemaComponentContext.displayName = 'SchemaComponentContext.Provider';
