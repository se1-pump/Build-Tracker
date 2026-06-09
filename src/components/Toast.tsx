import { useApp } from '../hooks/useApp';

export function Toast() {
  const { toastMsg, toastIsError } = useApp();

  if (!toastMsg) return null;

  return (
    <div className={`toast ${toastIsError ? 'error' : ''} show`}>
      {toastMsg}
    </div>
  );
}
