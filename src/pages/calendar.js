import React from 'react';
import BasicUIComponent from '../components/basicUI';
import DailyCalendarComponent from '../components/dailyCalendar';
import routerNavigate from '../wrapper/routerNavigate';

class CalendarPage extends React.Component {
    render() {
        const rootStyle = {
            width: '80%',
            height: '100%',
            margin: 'auto',
            overflow: 'auto',
        };

        return (
            <BasicUIComponent
                setDark={this.props.setDark}
                updatePage={() => this.locationUpdate()}>
                <div style={rootStyle}>
                    <DailyCalendarComponent />
                </div>
            </BasicUIComponent>
        );
    }
}

export default routerNavigate(CalendarPage);
