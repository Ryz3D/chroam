import React, { useEffect, useState } from 'react';

export default function windowSize(Component) {
    return React.forwardRef((props, ref) => {
        const [state, setState] = useState({
            width: window.innerWidth,
            height: window.innerHeight,
        });

        const hasWindow = window !== undefined;
        useEffect(() => {
            window.addEventListener('resize', () => {
                setState({
                    width: hasWindow ? window.innerWidth : 0,
                    height: hasWindow ? window.innerHeight : 0,
                });
            });
        }, [hasWindow]);

        return (
            <Component
                {...props}
                ref={ref}
                windowWidth={state.width}
                windowHeight={state.height}
            />
        );
    });
}
