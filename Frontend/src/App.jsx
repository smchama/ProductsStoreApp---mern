import { Box, Button } from "@chakra-ui/react";
import { Route, Routes} from "react-router-dom";

import HomePage from "./Pages/HomePage.jsx";
import CreatePage from "./Pages/CreatePage.jsx";
import Navbar from "./components/Navbar.jsx";

function App() {
  return (
    <Box minH = {"1000vh"}>

    <Navbar/> 

    <Routes>
      <Route path ="/" element ={<HomePage/>}/>
      <Route path ="/create" element ={<CreatePage/>}/>
    </Routes>

    </Box>
  )
}

export default App;

