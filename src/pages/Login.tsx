import type { User } from "firebase/auth";
import "./App.css";
import { Header } from "../components/Header";
import { useBreakpoint } from "../hooks/useBreakpoint";

type LoginPageProps = {
  user: User | null;
  error: string | null;
  onSignIn: () => void;
  onSignOut: () => void;
};

export default function LoginPage({ user, error, onSignIn, onSignOut }: LoginPageProps) {
  const { isMobile, isTablet } = useBreakpoint();
  const appClass = `app ${isMobile ? "app--mobile" : isTablet ? "app--tablet" : "app--desktop"}`;

  return (
    <div className={appClass}>
      <Header user={user} onSignIn={onSignIn} onSignOut={onSignOut} />

      <main className="main">
        {error && <div className="alert">{error}</div>}
        <section className="card">
          <h2>Antes de empezar</h2>
          <ol className="list">
            <li>En Firebase Console - Authentication - habilita "Google".</li>
            <li>En Firestore Database - crea la base (modo produccion recomendado).</li>
            <li>Luego vuelve aqui e inicia sesion.</li>
          </ol>
          <p className="muted">
            Este proyecto guarda tus movimientos en <code>users/&lt;uid&gt;/transactions</code>.
          </p>
        </section>
      </main>

      <footer className="footer">
        <span className="muted">
          Consejo: en Firebase Console puedes desplegar reglas para que solo tu usuario acceda a sus datos.
        </span>
      </footer>
    </div>
  );
}
