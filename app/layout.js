import "./index.scss";

export const metadata = {
  title: "Bougado Gaboudo",
  description: "Generated by create next app",
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
