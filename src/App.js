import { BrowserRouter, Outlet, Routes, Route } from 'react-router-dom';
import style from './App.module.css';

import AddGame from './AddGame';
import AddPerson from './AddPerson';
import Attendance from './Attendance';
import DatePicker from './DatePicker';
import EditPerson from './EditPerson';
import EditPersonList from './EditPersonList';
import GameDate from './GameDate';
import Main from './Main';

function Layout() {
  return (
    <div className={style.App}>
      <div className={style.body}>
        <Outlet />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Main />} />
          <Route path="person">
            <Route path="add" element={<AddPerson />} />
            <Route path="edit/:id" element={<EditPerson />} />
            <Route path="edit/list" element={<EditPersonList />} />
            <Route index element={<Attendance />} />
          </Route>
          <Route path="game">
            <Route path="add" element={<AddGame />} />
            <Route path="calendar" element={<DatePicker />} />
            <Route path="date/:date" element={<GameDate />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
