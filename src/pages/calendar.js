import React from 'react';
import BasicUIComponent from '../components/basicUI';
import DailyCalendarComponent from '../components/dailyCalendar';
import routerNavigate from '../wrapper/routerNavigate';

class CalendarPage extends React.Component {
    render() {
        return (
            <BasicUIComponent
                setDark={this.props.setDark}
                updatePage={() => this.locationUpdate()}>
                <DailyCalendarComponent />
            </BasicUIComponent>
        );
    }
}

export default routerNavigate(CalendarPage);
