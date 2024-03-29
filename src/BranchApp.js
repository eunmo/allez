import { useEffect } from 'react';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';

import AddIndividualGame from './AddIndividualGame';
import AddPerson from './AddPerson';
import AddTeamGame from './AddTeamGame';
import AddTournament from './AddTournament';
import Attendance from './Attendance';
import { BranchProvider } from './BranchContext';
import BranchSelect from './BranchSelect';
import DatePicker from './DatePicker';
import Duo from './Duo';
import EditIndividualGame from './EditIndividualGame';
import EditPerson from './EditPerson';
import EditPersonList from './EditPersonList';
import EditTeamGame from './EditTeamGame';
import EditTournament from './EditTournament';
import GameDate from './GameDate';
import Main from './Main';
import Person from './Person';
import Rank from './Rank';
import ViewIndividualGame from './ViewIndividualGame';
import ViewTeamGame from './ViewTeamGame';
import ViewTournament from './ViewTournament';
import { Header } from './components';
import { branchCodes } from './utils';
import style from './App.module.css';

export default function BranchApp() {
  const { branch } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!branchCodes.includes(branch)) {
      navigate(`/${branchCodes[0]}`);
    }
  }, [navigate, branch]);

  return (
    <BranchProvider>
      <Header />
      <div className={style.body}>
        <Routes>
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
            <Route path="tournament">
              <Route path="add" element={<AddTournament />} />
              <Route path="edit/:id" element={<EditTournament />} />
              <Route path="view/:id" element={<ViewTournament />} />
            </Route>
            <Route path="duo/:l/:r" element={<Duo />} />
          </Route>
          <Route path="branch" element={<BranchSelect />} />
        </Routes>
      </div>
    </BranchProvider>
  );
}
