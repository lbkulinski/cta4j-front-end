import React from 'react';

type Props = {
    children: React.ReactNode;
    fallback?: React.ReactNode;
};

type State = {
    hasError: boolean;
    error?: Error | null;
};

export default class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        // log to global rollbar if set, otherwise console
        const g = globalThis as any;
        if (g?.rollbar && typeof g.rollbar.error === 'function') {
            g.rollbar.error(error, info);
        } else {
            // still keep console for local dev
            // eslint-disable-next-line no-console
            console.error('Uncaught render error', error, info);
        }
        this.setState({ error });
    }

    render() {
        if (this.state.hasError) {
            return (
                this.props.fallback ?? (
                    <div style={{ padding: 16 }}>
                        <h2>Something went wrong</h2>
                        <p>Please refresh the page or try again later.</p>
                    </div>
                )
            );
        }
        return this.props.children;
    }
}
