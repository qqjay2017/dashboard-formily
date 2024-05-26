
import { PropsWithChildren } from 'react';
import { FC } from 'react';
import { ErrorBoundary, FallbackProps, useErrorBoundary } from 'react-error-boundary';

const ErrorFallback: FC<FallbackProps> = ({ error }) => {
    const { resetBoundary } = useErrorBoundary();


    return (
        <div style={{ backgroundColor: 'white' }}>
            <button onClick={resetBoundary}>重试</button>
            <div>  {error.stack}</div>
        </div>
    );
};



export const BlockItemError: FC<PropsWithChildren> = ({ children }) => {
    const handleErrors = (error: Error) => {
        console.error(error);
    };
    return (
        <ErrorBoundary FallbackComponent={ErrorFallback} onError={handleErrors}>
            {children}
        </ErrorBoundary>
    );
};
