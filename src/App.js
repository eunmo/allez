import { BrowserRouter, Outlet, Routes, Route } from 'react-router-dom';

import AddIndividualGame from './AddIndividualGame';
import AddPerson from './AddPerson';
import AddTeamGame from './AddTeamGame';
import Attendance from './Attendance';
import DatePicker from './DatePicker';
import EditIndividualGame from './EditIndividualGame';
import EditPerson from './EditPerson';
import EditPersonList from './EditPersonList';
import GameDate from './GameDate';
import Main from './Main';
import Person from './Person';
import { Header } from './components';
import style from './App.module.css';

function Layout() {
  return (
    <div className={style.App}>
      <Header />
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
            <Route path=":id" element={<Person />} />
            <Route index element={<Attendance />} />
          </Route>
          <Route path="game">
            <Route path="calendar" element={<DatePicker />} />
            <Route path="date/:date" element={<GameDate />} />
            <Route path="individual">
              <Route path="add" element={<AddIndividualGame />} />
              <Route path="edit/:id" element={<EditIndividualGame />} />
            </Route>
            <Route path="team">
              <Route path="add" element={<AddTeamGame />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
