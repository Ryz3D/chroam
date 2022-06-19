import './styles/index.css';
import './styles/fonts.css';
import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
// import { CSSTransition, TransitionGroup } from 'react-transition-group';
// import { isIOS } from 'react-device-detect';
import Parse from 'parse/dist/parse.min.js';

import DailyPage from './pages/daily';
import CalendarPage from './pages/calendar';
import MentionPage from './pages/mention';
import TopicPage from './pages/topic';
import MentionsPage from './pages/mentions';
import TopicsPage from './pages/topics';
import SettingsPage from './pages/settings';
import NotFoundPage from './pages/notFound';
import { grey, purple, teal } from '@mui/material/colors';

/*

TODO:
 - auto cleanup of empty localstorage items
 - cloud logging?
 - settings
  - light/dark
  - time/date mode
  - topic/mention format, default [] (what about mobile?)
  - auto-close bracket format
  - ChroamItem format and matcher
  - auto-initialize next checkbox, bullet, accordion
  - save all in localstorage!
- local storage first, later optional db sync and share with auth (befriended users as topics)
- templates? -> dailies and pages with optional text (checkbox/bullet structures)
- graph activity, share of topics over time
- graph mentions with numbers over time (space or comma separated), i.e. #mood 8
- link view (connection/reference diagram) for topics

*/

Parse.initialize('UFEdpP8t3rVz2pEESDzfPoCtpy24pmi8xl4OIufw', 'JNugHR2crlrApN3moh5SBS6mOH5FhpY8vBEwoInX');
Parse.serverURL = 'https://parseapi.back4app.com/';

function SimpleRoute(props) {
  const location = useLocation();

  return (
    <Routes location={location}>
      {props.children}
    </Routes>
  );
}

/*
function AnimationRoute(props) {
  const location = useLocation();

  return (
    <TransitionGroup>
      <CSSTransition
        key={location.pathname}
        classNames='slide'
        timeout={500}>
        <Routes location={location}>
          {props.children}
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
}
*/

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dark: (localStorage.getItem('darkMode') || '1') === '1',
    };
  }

  setDark(dark) {
    localStorage.setItem('darkMode', dark ? '1' : '0');
    this.setState({ dark });
  }

  render() {
    const theme = createTheme({
      palette: {
        mode: this.state.dark ? 'dark' : 'light',
        primary: {
          light: teal.A100,
          main: teal.A400,
          dark: teal.A700,
          contrastText: '#fff',
        },
        secondary: {
          light: purple[300],
          main: purple.A700,
          dark: purple[500],
          contrastText: '#fff',
        },
        info: this.state.dark ? teal : {
          light: grey[700],
          main: grey[800],
          dark: grey[900],
          contrastText: '#fff',
        },
      },
      typography: {
        fontFamily: "'Montserrat', 'Roboto', sans-serif",
        fontWeightLight: 200,
        fontWeightRegular: 400,
      },
    });

    //const routeComponent = isIOS ? SimpleRoute : AnimationRoute;
    const routeComponent = SimpleRoute;
    const pageProps = {
      setDark: (dark) => this.setDark(dark),
    };

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path='*' element={React.createElement(routeComponent, {
              children:
                <>
                  <Route path='/' element={<DailyPage {...pageProps} />} />
                  <Route path='/calendar' element={<CalendarPage {...pageProps} />} />
                  <Route path='/mention' element={<MentionPage {...pageProps} />} />
                  <Route path='/topic' element={<TopicPage {...pageProps} />} />
                  <Route path='/mentions' element={<MentionsPage {...pageProps} />} />
                  <Route path='/topics' element={<TopicsPage {...pageProps} />} />
                  <Route path='/settings' element={<SettingsPage {...pageProps} />} />
                  <Route path='*' element={<NotFoundPage {...pageProps} />} />
                </>
            })} />
          </Routes>
        </Router>
      </ThemeProvider>
    );
  }
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
