// src/App.js
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Home} />
        {/* สามารถเพิ่มเส้นทางอื่นๆ และ Component สำหรับหน้าอื่นๆ ตามต้องการ */}
      </Switch>
    </BrowserRouter>
  );
};

export default App;
