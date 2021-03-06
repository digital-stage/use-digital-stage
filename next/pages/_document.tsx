import Document, {Head, Html, Main, NextScript} from 'next/document'
import {Provider as StyletronProvider} from 'styletron-react'
import {styletron} from '../styletron'
import React from "react";

class MyDocument extends Document<{
    stylesheets: any
}> {
    static getInitialProps(props) {
        const page = props.renderPage((App) => (props) => (
            <StyletronProvider value={styletron}>
                <App {...props} />
            </StyletronProvider>
        ))
        const stylesheets = styletron.getStylesheets() || []
        return { ...page, stylesheets }
    }

    render() {
        return (
            <Html>
                <Head>
                    {this.props.stylesheets.map((sheet, i) => (
                        <style
                            className="_styletron_hydrate_"
                            dangerouslySetInnerHTML={{ __html: sheet.css }}
                            media={sheet.attrs.media}
                            data-hydrate={sheet.attrs['data-hydrate']}
                            key={i}
                        />
                    ))}
                    <link href="/static/fonts/open-sans/style.css" rel="stylesheet"/>
                    <link href="/static/fonts/poppins/style.css" rel="stylesheet"/>
                </Head>
                <body>
                <Main />
                <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument
