import { BrowserRouter, Routes, Route } from 'react-router-dom';
import style from './App.module.css';

function App() {
  return (
    <div className={style.App}>
      <BrowserRouter>
        <Routes>
          <Route index element={<>Hello</>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
