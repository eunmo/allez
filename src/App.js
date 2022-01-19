import { BrowserRouter, Routes, Route } from 'react-router-dom';
import style from './App.module.css';

import AddPerson from './AddPerson';
import Attendance from './Attendance';

export default function App() {
  return (
    <div className={style.App}>
      <BrowserRouter>
        <div className={style.body}>
          <Routes>
            <Route index element={<AddPerson />} />
            <Route path="attendance" element={<Attendance />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}
