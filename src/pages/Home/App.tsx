import ReactLogo from '@assets/react.svg?react';
import ViteLogo from '@assets/vite.svg?react';
import { useState } from 'react';
import styles from './App.module.scss';

const App = () => {
  const [count, setCount] = useState<number>(0);

  return (
    <>
      <div>
        <a
          href="https://vite.dev"
          target="_blank"
          className={styles.logoContainer}
        >
          <div className={styles.logoWrapper}>
            <ViteLogo className={styles.logo} />
          </div>
        </a>
        <a
          href="https://react.dev"
          target="_blank"
          className={styles.logoContainer}
        >
          <div className={styles.logoWrapper}>
            <ReactLogo className={`${styles.logo} ${styles.react}`} />
          </div>
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className={styles.card}>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className={styles.readTheDocs}>
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
};

export default App;
