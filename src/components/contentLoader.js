import * as mui from '@mui/material';
import { useNavigate } from 'react-router';

export default function ContentLoader(props) {
    const navigate = useNavigate();

    return (
        <mui.Modal open={props.active || false}>
            <mui.Grid>
                <mui.Box sx={{
                    position: 'fixed',
                    top: '0', left: '0',
                    bottom: '0', right: '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <mui.Box sx={{
                        textAlign: 'center',
                    }}>
                        <mui.CircularProgress />
                        <div style={{ height: '8px' }} />
                        <mui.Button sx={{
                            display: 'flex',
                            flexDirection: 'column',
                        }} variant='outlined' onClick={() => navigate('/settings')}>
                            Check your settings?
                        </mui.Button>
                    </mui.Box>
                </mui.Box>
            </mui.Grid>
        </mui.Modal>
    );
}
