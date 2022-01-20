import { BrowserRouter, Routes, Route } from 'react-router-dom';
import style from './App.module.css';

import AddPerson from './AddPerson';
import Attendance from './Attendance';
import EditPerson from './EditPerson';
import EditPersonList from './EditPersonList';

export default function App() {
  return (
    <div className={style.App}>
      <BrowserRouter>
        <div className={style.body}>
          <Routes>
            <Route index element={<AddPerson />} />
            <Route path="person/add" element={<AddPerson />} />
            <Route path="person/attendance" element={<Attendance />} />
            <Route path="person/edit/:id" element={<EditPerson />} />
            <Route path="person/edit/list" element={<EditPersonList />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}
