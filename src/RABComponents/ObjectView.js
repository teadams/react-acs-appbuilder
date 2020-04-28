import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as log from '../Utils/log.js'
import * as meta from '../Utils/meta.js'
import * as data from '../Utils/data.js';
import * as u from '../Utils/utils.js';
import ACSRowController from '../Functional/ACSRowController.js'
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';

function ObjectView(props)  {
  const {object_type,id,layout="list"} = props
    
  const list_wrap = {field:"ListItem", field_set:"List"}

  return <ACSRowController object_type={props.object_type} id={props.id} wrap={list_wrap}/>
}
export default ObjectView;

