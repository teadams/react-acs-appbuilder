import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React,  {Fragment} from 'react';
import {Paper,  Typography, Button, Grid} from '@material-ui/core';
//import * as meta from '../../Utils/meta.js'
import {AuthContext} from '../User';
import ACSObjectCount from '../../Functional/Text/ACSObjectCount.js'
import {Field, ObjectView} from "../Experimental"
import {ProjectHover} from "../NowWeAct"
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import {CreateForm} from "../Layouts/index.js";
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';
import * as data from '../../Utils/data.js';
import * as u from '../../Utils/utils.js'
import * as google_map from './api.js'
import {  BrowserRouter as Router,  Switch,  Route,  Link,  Redirect, useHistory } from "react-router-dom";


class GoogleMap extends React.Component {
  constructor(props) {
        super(props);
        this.state = {
            marker_data: [],
            showInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
        }   
        this.handleMoreClick = this.handleMoreClick.bind(this);
        this.handleCreateProjectOpen = this.handleCreateProjectOpen.bind(this);
        this.handleProjectCreated = this.handleProjectCreated.bind(this);
  }

  handleCreateProjectOpen()  {
    this.setState({create_project_open:true});
  }

  handleProjectCreated(action_text, inserted_id, formValues)  {
    // most of this will go server side
    this.setState({create_project_open:false})
    // though we have access to formValues, state and Country
    //  are id's and not the text name.   Simplest path forward
    // (unfortunately) is to query back the project infor from
    // the server

    if (!inserted_id) {
        return
    }

    let options = {}
    options.id = inserted_id

    data.getData("nwn_project", options, (project_data, error) => { 

      const other_fields = {
        leader_notes: 'Creator',
        creation_user: this.context.user.id
      }

      const role_add_obj = {
        user_id: this.context.user.id,
        subsite_id: inserted_id,
        role_name: "Admin",
        status: "Accepted",
        other_fields: other_fields
      }

      data.callAPI("auth/create-subsite-role", {}, role_add_obj, "post", (role_add_result, error ) => {
          let new_user_context = this.context.user
          new_user_context.context_list = role_add_result.context_list
          new_user_context.authorization_object = role_add_result.authorization_object
          this.context.login(new_user_context)
          this.context.setContextId(inserted_id)
          // direct to project page
        
          this.props.onMenuChange("",5)

      })
          // Let this happen in parallel. User will be redirected so we do not have to wait
      let params = {}
      params.address= project_data.street_address  + ", " + project_data.city  +", " + project_data["state_name"] +",  " + project_data["country_name"] +", " + project_data.zip_code
      params.key = google_map.get_key() 
      data.getURL("https://maps.googleapis.com/maps/api/geocode/json", params, (result, error) => { 
          options.latitude = result.results[0].geometry.location.lat
          options.longitude = result.results[0].geometry.location.lng 

          data.putData("nwn_project", options, {}, (data, error) => { 
              if (error) {
                    alert ('error is ' + error.message)
              } 
          })     
        })
    })

  }

  handleMoreClick = event => {
      console.log('button has been clicked')
      alert ('handle clik')
      //this.props.onMore(event, this.props.link_menu_index, this.props.filter_id, this.props.menu_link_field, this.props.link_object_type, this.props.menu_link_reference_field)
  }

  onMouseover = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showInfoWindow: true
  });
  
componentDidMount() {
      log.val('drill down did mount')

      data.getData(this.props.object_type, "", (marker_data, error) => {
             this.setState({ marker_data:marker_data})
      })

      
  }


  render() {

    let sections = "basic,location"
    return (
      <Fragment>
        <Grid container >
          <Grid item  style={{padding:20}}>
          <Typography variant="headline">
           {this.props.title}
          </Typography>
          </Grid>
          <Grid item  style={{padding:20}}> <Button variant="contained" onClick={this.handleCreateProjectOpen}>Create a Project</Button></Grid>
          <Grid item  style={{padding:20}}>
            <ACSObjectCount api_options={{get_count:true, num_rows:1,}} text="Number of active projects:" object_type="nwn_project"/> 

            <ACSObjectCount api_options={{get_count:true, num_rows:1, filter_id:"Success", filter_field:"status"}} text="Number of sucessful projects:" object_type="nwn_project"/>

            <ACSObjectCount api_options={{get_count:true, num_rows:1}} text="Number of volunteers:" object_type="nwn_project_volunteer"/> 
          </Grid>
          </Grid>
        
        {this.state.create_project_open &&
          <CreateForm
            object_type="nwn_project" 
            open={this.state.create_project_open}
            hidden={{leader:true}}
            onClose={this.handleProjectCreated}
            sections={sections}
          />}
        <Typography variant="body1" style={{padding:10}}>
            {this.props.text}
          <Map google={this.props.google} zoom={3}>
            {this.state.marker_data.map(marker => {
            //  alert ("maker is " + JSON.stringify(marker))
              var icon
              if (marker.type.thumbnail) {
                const thumbnail = JSON.parse(marker.type.thumbnail)
                const icon_name = thumbnail.name
                const path = thumbnail.path
                const url = path+icon_name
                icon = {url:url, 
                        scaledSize:{"width":20,"height":20}}
              }  else  {
                icon = ""
              }

              var position = {}
              position.lat = marker.latitude
              position.lng = marker.longitude
            
              return (
              <Marker onMouseover={this.onMouseover}

              name={marker.name}
              project_type = {marker.project_type}
              summary = {marker.summary}
              description = {marker.description}
              leader_first_name = {marker.leader_first_name}
              leader_last_name = {marker.leader_last_name}
              full_marker = {marker}
              onMore= {this.props.onMore}
              icon = {icon}
              id = {marker.id}
              position={position}></Marker>
              )
            })}
    
            <InfoWindow maxWidth="100%" marker={this.state.activeMarker}  visible={this.state.showInfoWindow}>
                <ProjectHover   object_type = {this.props.object_type}
                  name = {this.state.selectedPlace.name}
                  selected_id = {this.state.selectedPlace.id}
                  description = {this.state.selectedPlace.description}
                leader_first_name = {this.state.selectedPlace.leader_first_name}
                leader_last_name = {this.state.selectedPlace.leader_last_name}
                  summary = {this.state.selectedPlace.summary}
                full_marker = {this.state.selectedPlace.full_marker}
                handleMoreClick = {this.handleMoreClick}/>
            </InfoWindow>
        </Map>
        </Typography>

      </Fragment>
    )
  }
}

GoogleMap.contextType = AuthContext;
export default GoogleApiWrapper({
  apiKey: google_map.get_key()
})(GoogleMap)