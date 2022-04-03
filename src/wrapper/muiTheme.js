import React from 'react';
import { useTheme } from '@mui/material';

export default function muiTheme(Component) {
    return React.forwardRef((props, ref) => {
        const theme = useTheme();
        return (
            <Component
                {...props}
                theme={theme}
                ref={ref}
            />
        );
    });
};
