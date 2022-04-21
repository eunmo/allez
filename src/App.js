import { BrowserRouter, Outlet, Routes, Route } from 'react-router-dom';

import AddIndividualGame from './AddIndividualGame';
import AddPerson from './AddPerson';
import AddTeamGame from './AddTeamGame';
import Attendance from './Attendance';
import DatePicker from './DatePicker';
import Duo from './Duo';
import EditIndividualGame from './EditIndividualGame';
import EditPerson from './EditPerson';
import EditPersonList from './EditPersonList';
import EditTeamGame from './EditTeamGame';
import GameDate from './GameDate';
import Main from './Main';
import Person from './Person';
import Rank from './Rank';
import ViewIndividualGame from './ViewIndividualGame';
import ViewTeamGame from './ViewTeamGame';
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
            <Route path="rank" element={<Rank />} />
            <Route path=":id" element={<Person />} />
            <Route index element={<Attendance />} />
          </Route>
          <Route path="game">
            <Route path="calendar" element={<DatePicker />} />
            <Route path="date/:date" element={<GameDate />} />
            <Route path="individual">
              <Route path="add" element={<AddIndividualGame />} />
              <Route path="edit/:id" element={<EditIndividualGame />} />
              <Route path="view/:id" element={<ViewIndividualGame />} />
            </Route>
            <Route path="team">
              <Route path="add" element={<AddTeamGame />} />
              <Route path="edit/:id" element={<EditTeamGame />} />
              <Route path="view/:id" element={<ViewTeamGame />} />
            </Route>
            <Route path="duo/:l/:r" element={<Duo />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
