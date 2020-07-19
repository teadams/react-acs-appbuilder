import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React,  {useContext, useState, Fragment} from 'react';
import {Paper,  Typography, Button, Grid, Popover} from '@material-ui/core';
//import * as meta from '../../Utils/meta.js'
import {AuthContext} from '../../Components/User';

import ACSObjectCount from '../../Functional/Text/ACSObjectCount.js'
import ACSCreateButton from '../../Functional/Buttons/ACSCreateButton.js'
import ACSCreateDialogButton from '../../Functional/Buttons/ACSCreateDialogButton.js'
import ACSObjectView from '../../Functional/Rows/ACSObjectView.js'
// XX TODO
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';
import * as data from '../../Utils/data.js';
import * as u from '../../Utils/utils.js'
import { useHistory } from "react-router-dom";
import ACSMap from "../Lists/ACSMap.js"
import * as control from '../../Utils/control.js'


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    learn_button: {
      display:'flex',
      justifyContent:'center'
    },
    grow: {
      flexGrow: 1,
      display:'flex'
    },
    head_row: {
      display:'flex',
      padding:'10px'
    }, 
    head_count_wrapper: {
      display:'flex',
      justifyContent:'flex-end'
    },
    head_count_item: {
      display:'flex',
      padding:'0px',
      paddingRight:'20px'
    }, 
    paper: {
      backgroundColor: '#DDDDDD',
      maxWidth:'40%',
      maxHeight:'75%',
      alight:'center',
      border: '2px solid #000',
      borderRadius: '25px',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }),
);

function ACSMapAndFilter (props) {
  // layout params
  const { object_type, details_screen_field_list, create_field_list, layout, sections, dialog_size, more_path="Job", more_button_text="Learn More", action_button_text="Apply", action_component_name="ACSObjectView", action_link_field="job_listing", action_object_type="job_listing", create_marker_button_text="Create Job Listing"} = props

  const ActionComponent = control.componentByName(action_component_name)

  const {icon_type_field="job_type", onClick, latitude, longitude, latitude_field="latitude", longitude_field="longitude", initial_zoom=3, onMarkerClick, onMapClick, onMouseover, PopupComponent, centerAroundCurrentLocation=false, maxPopoverWidth=250, centerAroundSubsiteLocation=true, summary_cutoff=100, description_cutoff=""} = props

  const classes = useStyles();
  const context = useContext(AuthContext)
  const history = useHistory({});

  const [marker_data, setMarkerData] = useState("")
  const [show_side_window, setShowSideWindow] =useState(false)
  const [selected_place, setSelectedPlace]= useState({subsite_data:{}})


  function redirectToMore() {
      window.scrollTo(0,0)
    // TODO - if object_type is core_subsite
    //     context.setContextId(selected_place.id)
      let path = `/${more_path}/${selected_place.id}`
      history.push(path);
  }

  const handleActionSubmit= (event,action, project_data, inserted_id) => {
  }

  const handleCreateMarkerSubmit= (event,action, project_data, inserted_id) => {
      redirectToMore()
  }

  const handleOnMarkerClick = (marker, m, e) => {
    if (selected_place.id !== marker.marker_data.id) {
      setSelectedPlace(marker.marker_data)
    }
    if (!show_side_window) {
      setShowSideWindow(true)
    }
  };

  const handleOnMapClick = (id, marker, e) => {
    if (show_side_window) {
      setShowSideWindow(false)
    }
  };
  
  const handleMoreClick = event => {
    redirectToMore()
  }
  

  
 let id, action_props
 if (action_link_field) {
      action_props = {[action_link_field]:selected_place.id}
  } else {
      id = selected_place.id
  }
  
  const ActionButton = function(props) {
      return (<Button {...props}>{action_button_text}</Button>)
  }

  const CreateMarkerButton = function(props) {
      return (<Button variant="contained" color="primary" style={{margin:10}} {...props}>{create_marker_button_text}</Button>)
  }

  return (
    <Fragment>
      {show_side_window && 
      <div style={{width:400, height:"85%", zIndex:1, position:"absolute", backgroundColor:"white"}}>
        <ACSCreateButton   ButtonComponent={CreateMarkerButton} object_type={object_type}  onSubmit={handleCreateMarkerSubmit}/>
        <Typography>
          <ACSObjectView  object_type =  {object_type}
            id = {selected_place.id}
            data = {selected_place}
            field_mode = "view"
            field_list = {details_screen_field_list}
            field_click_to_edit = {false}
            num_columns={1}
            row_header_image_size="medium"
            handleMoreClick = {handleMoreClick}/>
        </Typography>
        <div style={{display:"flex", width:"100%", justifyContent:"space-evenly"}}>
          <ACSCreateDialogButton   ButtonComponent={ActionButton} DialogComponent={ActionComponent} object_type={object_type} row_mode="create" row_form="true"  id={id}  action_props={action_props} onSubmit={handleActionSubmit}/>
          <Button   onClick={handleMoreClick}>{more_button_text}</Button>
        </div> 
      </div>}
      {!show_side_window &&
      <div  style={{zIndex:1, position:"absolute"}}>
      <ACSCreateButton   ButtonComponent={CreateMarkerButton} object_type={object_type}  onSubmit={handleCreateMarkerSubmit}/>
      </div>}
      <ACSMap onMarkerClick={handleOnMarkerClick} onMapClick={handleOnMapClick} object_type={object_type} container_height="85%" container_width="98%"/>
    </Fragment>
    )
  }



export default ACSMapAndFilter;
