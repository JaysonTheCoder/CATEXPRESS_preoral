import { useEffect, useState } from 'react';
import FixedDrawer from "./partials/Drawer";
import Table from './partials/Table';
import Addform from './partials/Addform';
import Editform from './partials/Editform';
export default function OperatorM() {
    const [ openAddForm, setOpenAddForm ] = useState(false)
    const [ openEditForm, setOpenEditForm ] = useState(false)
    const drawerWidth = 240;


  var editF = {
    open: ()=> setOpenEditForm(true),
    close: () => setOpenEditForm(false)
  }

  var addF = {
    open: ()=> setOpenAddForm(true),
    close: () => setOpenAddForm(false)
  }
  return (
    <div className="container">
      { openAddForm && <Addform close={addF.close}/>}
      { openEditForm && <Editform close={editF.close}/>}
      <div className="content" style={{marginLeft: drawerWidth}}>
        <div className="app-bar">
            <div className="title">
                Conductor Profile
            </div>
        </div>
        <div className="main">
          <Table openForm={editF.open} openAddform={addF.open}/>
        </div>
      </div>
      <FixedDrawer drawerWidth={drawerWidth}/>
    </div>
  );
}
