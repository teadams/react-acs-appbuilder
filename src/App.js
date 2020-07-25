import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React, { Component, Fragment} from 'react';
import Template from "./Template.js"
import {AuthContextProvider} from './Components/User';
import ModelContextProvider from './ModelContextProvider.js';
import UIContextProvider from './Template/UIContextProvider.js';
import * as meta from './Utils/meta.js'
import useGetModel from "./Hooks/useGetModel.js"

function App(props) {
  return      (
    <ModelContextProvider>
      <AuthContextProvider>
       <UIContextProvider>
            <Template {...props}/>
      </UIContextProvider>
    </AuthContextProvider>
  </ModelContextProvider>
  )
}

export default App;



