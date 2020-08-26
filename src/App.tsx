import React, { useState, useLayoutEffect } from 'react';
import { IntlProvider } from 'react-intl';
import './App.css';

// Import from react core components
import { ThemeProvider as RMWCThemeProvider, RMWCProvider, Themes } from '@map-colonies/react-core';
import { CssBaseline } from '@map-colonies/react-components';
import { useMediaQuery } from '@map-colonies/react-components';
import '@map-colonies/react-core/dist/theme/styles';
import '@map-colonies/react-core/dist/button/styles';
import '@map-colonies/react-core/dist/tooltip/styles';
import '@map-colonies/react-core/dist/menu/styles';
import '@map-colonies/react-core/dist/select/styles';
import '@map-colonies/react-core/dist/circular-progress/styles';
import '@map-colonies/react-core/dist/typography/styles';
import '@map-colonies/react-core/dist/dialog/styles';
import '@map-colonies/react-core/dist/textfield/styles';

import ExporterView from './conflicts/views/exporter-view';
import MESSAGES from './common/i18n';

const App: React.FC = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [lang, setLang] = useState('he');
  const theme = prefersDarkMode ? Themes.darkTheme : Themes.lightTheme;
  
  useLayoutEffect(()=>{
    setLang(document.documentElement.lang);
  },[]);

  return (
    <IntlProvider locale={lang} messages={MESSAGES[lang]}>
      <RMWCProvider 
        typography={{
          body1: 'p'
        }}
      >
        <RMWCThemeProvider options={theme}>
          <CssBaseline />
          <ExporterView />
        </RMWCThemeProvider>
      </RMWCProvider>
    </IntlProvider>
  );
};

export default App;
