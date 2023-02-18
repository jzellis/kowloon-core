import "../styles/globals.css";
import Layout from "../components/Layout";

export default function MyApp({ Component, pageProps }) {
  // Use the layout defined at the page level, if available
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
