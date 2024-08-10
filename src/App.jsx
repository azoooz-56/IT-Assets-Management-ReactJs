import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './Pages/Dashboard/Dashboard';
import Assets from './Pages/Assets/Assets';
import { SnackbarProvider, useSnackbar } from 'notistack';


function App() {
  return (
    <SnackbarProvider maxSnack={3}>
    <div className="App">
      <div className="container">
        <BrowserRouter>
          <Sidebar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/assets" element={<Assets />} />
            </Routes>
          </div>
        </BrowserRouter>
      </div>
    </div>
    </SnackbarProvider>
  );
}

export default App;
