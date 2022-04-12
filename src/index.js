import './styles/index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { isIOS } from 'react-device-detect';
import { initializeApp } from 'firebase/app';

import DailyPage from './pages/daily';
import MentionPage from './pages/mention';
import TopicPage from './pages/topic';
import SettingsPage from './pages/settings';
import NotFoundPage from './pages/notFound';
import { grey, purple, teal } from '@mui/material/colors';

/*

TODO:
 - > for accordions
 - * for bullets
 - ^\s*\] for unchecked
 - ^\[?x\] for checked
 - replace bullets with checkboxes even though they are the same
 - enter in checkbox line adds new check, in bullet line new bullet
 - edit line of current cursor, display others
  - if editing closed accordion
 - cloud logging?
 - plan tomorrow (notes to be shown in next daily?)
 - top menu
  - search/add topic
  - last day
  - next day
  - highlight current daily
 - settings
  - light/dark
  - time/date mode
  - topic/mention format, default [] (what about mobile?)
  - auto-close bracket format
  - save all in localstorage!
- local storage first, later optional db sync and share with auth (befriended users as topics)
 - calendar view with activity, edit or create dailies
 - last dailies and fav topics in sidebar
 - bullet points (optional with time picker)
 - checkboxes!
 - templates? -> dailies and pages with optional text (checkbox/bullet structures)
 - list all pages with mentions
 - content first then pages and dailies (including sub-bullets) including topic
 - graph activity, share of topics over time

*/

const firebaseConfig = {
  apiKey: "AIzaSyDYrPLeDpZj_KqPC-r5S_Lt0C-cd_96EXA",
  authDomain: "chroam-26063.firebaseapp.com",
  projectId: "chroam-26063",
  storageBucket: "chroam-26063.appspot.com",
  messagingSenderId: "515202351677",
  appId: "1:515202351677:web:fb6f2e67e0e81533416054"
};

initializeApp(firebaseConfig);

function SimpleRoute(props) {
  const location = useLocation();

  return (
    <Routes location={location}>
      {props.children}
    </Routes>
  );
}

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

    const routeComponent = isIOS ? SimpleRoute : AnimationRoute;
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
                  <Route path='/mention' element={<MentionPage {...pageProps} />} />
                  <Route path='/topic' element={<TopicPage {...pageProps} />} />
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
