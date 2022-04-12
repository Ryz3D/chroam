import React from 'react';
import { useLocation } from 'react-router-dom';

export default function routerLocation(Component) {
    return React.forwardRef((props, ref) => {
        const location = useLocation();
        return (
            <Component
                {...props}
                navigate={location}
                ref={ref}
            />
        );
    });
};
