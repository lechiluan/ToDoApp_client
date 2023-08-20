import {Route, Routes, Navigate} from 'react-router-dom';
import Main from './components/Main'
import Signup from './components/Signup';
import Signin from './components/Signin';

function App() {
  const user = localStorage.getItem("token");

  return(
    <Routes>
     {user && <Route path ="/" exact element={<Main/>}/>}
     <Route path ="/signup" exact element={<Signup/>}/>
     <Route path ="/signin" exact element={<Signin/>}/>
     <Route path ="/" exact element={<Navigate replace to = "/signin"/>}/>
    </Routes>
  )
}
export default App;