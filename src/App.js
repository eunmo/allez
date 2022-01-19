import { BrowserRouter, Routes, Route } from 'react-router-dom';
import style from './App.module.css';

import AddPerson from './AddPerson';

export default function App() {
  return (
    <div className={style.App}>
      <BrowserRouter>
        <div className={style.body}>
          <Routes>
            <Route index element={<AddPerson />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}
