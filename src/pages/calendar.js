import React from 'react';
import BasicUIComponent from '../components/basicUI';
import DailyCalendarComponent from '../components/dailyCalendar';

class CalendarPage extends React.Component {
    render() {
        const rootStyle = {
            width: '80%',
            height: '100%',
            margin: 'auto',
            overflow: 'auto',
        };

        return (
            <BasicUIComponent setDark={this.props.setDark}>
                <div style={rootStyle}>
                    <DailyCalendarComponent />
                </div>
            </BasicUIComponent>
        );
    }
}

export default CalendarPage;
