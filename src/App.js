import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';

import BranchApp from './BranchApp';
import style from './App.module.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className={style.App}>
        <Routes>
          <Route path=":branch/*" element={<BranchApp />} />
          <Route path="*" element={<Navigate to="daechi" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
