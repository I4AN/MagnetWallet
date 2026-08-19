import type { User } from "firebase/auth";
import "./App.css";
import { Header } from "../components/Header";
import { useBreakpoint } from "../hooks/useBreakpoint";
import logo from "../assets/magnet.png";

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

      <main className="main main--login">
        {error && <div className="alert">{error}</div>}
        <section className="card login">
          <img className="login__logo" src={logo} alt="Magnet Wallet" />
          <h1 className="login__title">Bienvenido a Magnet Wallet</h1>
          <p className="login__subtitle">
            Registra tus gastos e ingresos, define presupuestos por categoria y descubre en que se va tu dinero mes a
            mes.
          </p>
          <button className="btn btn--primary login__cta" onClick={onSignIn}>
            Iniciar sesion con Google
          </button>
          <ul className="login__features">
            <li>📊 Resumen mensual con graficos</li>
            <li>🎯 Presupuestos por categoria</li>
            <li>🔒 Tus datos son privados: solo tu cuenta puede verlos</li>
          </ul>
        </section>
      </main>

      <footer className="footer">
        <span className="muted">Magnet Wallet — control personal de gastos.</span>
      </footer>
    </div>
  );
}
