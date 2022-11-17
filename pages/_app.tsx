import * as React from 'react';
import type { AppProps } from 'next/app';
import { CacheProvider, EmotionCache } from '@emotion/react';
// third-party
import {Provider as ReduxProvider} from 'react-redux';

import createEmotionCache from '../src/utility/createEmotionCache';
import ThemeCustomization from "../src/themes";
import { store } from '../src/store';
import {fetchJson} from "../src/restapi/";
import { SWRConfig } from "swr";

interface MyAppProps extends AppProps {
    emotionCache?: EmotionCache;
}

const clientSideEmotionCache = createEmotionCache();

const MyApp: React.FunctionComponent<MyAppProps> = (props) => {

    const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

    return (
        <SWRConfig
            value={{
                fetcher: fetchJson,
                onError: (err) => {
                    console.error(err)
                },
            }}
        >
            <ReduxProvider store={store}>
                <CacheProvider value={emotionCache}>
                    <ThemeCustomization>
                        <Component {...pageProps} />
                    </ThemeCustomization>
                </CacheProvider>
            </ReduxProvider>
        </SWRConfig>
    );
};

export default MyApp;
