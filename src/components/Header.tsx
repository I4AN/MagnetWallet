import type { User } from "firebase/auth";

type HeaderProps = {
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
};

export function Header({ user, onSignIn, onSignOut }: HeaderProps) {
  return (
    <header className="header">
      <div className="brand">
        <div className="brand__text">
          <div className="brand__title">MagnetWallet</div>
          <div className="brand__subtitle">Control personal de gastos</div>
        </div>
      </div>

      <div className="auth">
        {user ? (
          <>
            <div className="user">
              {user.photoURL ? (
                <img className="user__avatar" src={user.photoURL} alt="Avatar" />
              ) : (
                <div className="user__avatar user__avatar--placeholder" />
              )}
              <div className="user__meta">
                <div className="user__name">{user.displayName ?? "Usuario"}</div>
                <div className="user__email">{user.email ?? ""}</div>
              </div>
            </div>

            <button className="btn" onClick={onSignOut}>
              Cerrar sesion
            </button>
          </>
        ) : (
          <button className="btn btn--primary" onClick={onSignIn}>
            Iniciar sesion con Google
          </button>
        )}
      </div>
    </header>
  );
}
