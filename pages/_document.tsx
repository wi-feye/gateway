import * as React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import createEmotionServer from '@emotion/server/create-instance';
import createEmotionCache from '../src/utility/createEmotionCache';

export default class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    <meta name="description" content="Crowd Behavior Analysis" />
                    <link rel="icon" href="/favicon.ico" />

                    <meta name="application-name" content="WiFeye" />
                    <meta name="apple-mobile-web-app-capable" content="yes" />
                    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                    <meta name="apple-mobile-web-app-title" content="WiFeye" />
                    <meta name="description" content="Crowd Behavior Analysis" />
                    <meta name="format-detection" content="telephone=no" />
                    <meta name="mobile-web-app-capable" content="yes" />
{/*                    <meta name="msapplication-config" content="/icons/browserconfig.xml" />
                    <meta name="msapplication-TileColor" content="#2B5797" />
                    <meta name="msapplication-tap-highlight" content="no" />
                    <meta name="theme-color" content="#000000" />*/}

                    <link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" />
                    <link rel="apple-touch-icon" sizes="152x152" href="/icons/touch-icon-ipad-152x152.png" />
                    <link rel="apple-touch-icon" sizes="180x180" href="/icons/touch-icon-iphone-retina-180x180.png" />
                    <link rel="apple-touch-icon" sizes="167x167" href="/icons/touch-icon-ipad-retina-167x167.png" />

                    <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
                    <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
                    <link rel="manifest" href="/manifest.json" />
                    <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#5bbad5" />
                    <link rel="shortcut icon" href="/favicon.ico" />

                    <meta name="twitter:card" content="summary" />
                    <meta name="twitter:url" content="https://wifeye.com" />
                    <meta name="twitter:title" content="WiFeye" />
                    <meta name="twitter:description" content="Crowd Behaviour Analysis" />
                    <meta name="twitter:image" content="https://wifeye.com/icons/android-chrome-192x192.png" />
                    <meta name="twitter:creator" content="WiFeye" />
                    <meta property="og:type" content="website" />
                    <meta property="og:title" content="WiFeye" />
                    <meta property="og:description" content="Crowd Behaviour Analysis" />
                    <meta property="og:site_name" content="WiFeye" />
                    <meta property="og:url" content="https://wifeye.com" />
                    <meta property="og:image" content="https://wifeye.com/icons/icon-512x512.png" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
    // Resolution order
    //
    // On the server:
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. document.getInitialProps
    // 4. app.render
    // 5. page.render
    // 6. document.render
    //
    // On the server with error:
    // 1. document.getInitialProps
    // 2. app.render
    // 3. page.render
    // 4. document.render
    //
    // On the client
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. app.render
    // 4. page.render

    const originalRenderPage = ctx.renderPage;

    // You can consider sharing the same emotion cache between all the SSR requests to speed up performance.
    // However, be aware that it can have global side effects.
    const cache = createEmotionCache();
    const { extractCriticalToChunks } = createEmotionServer(cache);

    /* eslint-disable */
    ctx.renderPage = () =>
        originalRenderPage({
            enhanceApp: (App: any) => (props) =>
                <App emotionCache={cache} {...props} />,
        });
    /* eslint-enable */

    const initialProps = await Document.getInitialProps(ctx);
    // This is important. It prevents emotion to render invalid HTML.
    // See https://github.com/mui-org/material-ui/issues/26561#issuecomment-855286153
    const emotionStyles = extractCriticalToChunks(initialProps.html);
    const emotionStyleTags = emotionStyles.styles.map((style) => (
        <style
            data-emotion={`${style.key} ${style.ids.join(' ')}`}
            key={style.key}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: style.css }}
        />
    ));

    return {
        ...initialProps,
        // Styles fragment is rendered after the app and page rendering finish.
        styles: [
            ...React.Children.toArray(initialProps.styles),
            ...emotionStyleTags,
        ],
    };
};
