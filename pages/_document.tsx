import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head />
        <body className="bg-offwhite">
          <div className="container mx-auto">
            <Main />
          </div>
          <NextScript />
          <script async src="https://cdn.builder.io/js/fiddle"></script>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
