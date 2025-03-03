import "./index.scss";

export const metadata = {
  title: "Bougado",
  description: "Site d'illustration de Bougado",
  icons: "/img/logo.png"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
