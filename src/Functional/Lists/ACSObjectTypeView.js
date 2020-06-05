import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../Utils/log.js'
import ACSListController from '../ACSListController.js'

import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';


function ACSObjectTypeView(props)  {
  const {object_type, api_options, ...params} = props
  return (<ACSListController {...params} object_type={object_type} api_options={api_options}/> )
}
export default ACSObjectTypeView;

