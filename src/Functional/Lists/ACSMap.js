import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React, {useState, useContext, Fragment} from 'react';
import {Typography} from '@material-ui/core';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import * as api from '../../Utils/data.js';
//import * as u from '../../Utils/utils.js'
import * as google_map from './api.js'

import {AuthContext} from '../../Modules/User';
import useGetModel from '../../Hooks/useGetModel';


function get_image_url (image_object) {
    const image_base = (process.env.NODE_ENV ==="production")? "https://storage.googleapis.com/acs_full_stack/":""

    if (image_object && image_object.path && image_object.name) {
      return (image_base  + image_object.path +"/"+ image_object.name)
    } else {
      return 
    }     
}

class CustomMarker extends Marker {
  componentDidUpdate(prevProps) {
    if(
      this.props.map !== prevProps.map || 
      (this.props.icon && ( this.props.icon.url !== prevProps.icon.url )) || 
      (
        this.props.position.lat !== prevProps.position.lat || 
        this.props.position.lng !== prevProps.position.lng
      )
    ) {
      if(this.marker) {
        this.marker.setMap(null);
      }
      this.renderMarker();
    }
  }
}

function ACSMap (props) {
  const {object_type, api_options, icon_type_field="",  latitude, longitude, latitude_field="core_address_latitude", longitude_field="core_address_longitude", initial_zoom=3, onMarkerClick, onMapClick, onMouseover, PopupComponent, map_center="location", maxPopoverWidth=250, summary_cutoff=100, description_cutoff="", container_height="75%", container_width="75%", load_own_data=true} = props
  let {data:props_map_data} = props

  if (props_map_data !== null && props_map_data !== undefined && !Array.isArray(props_map_data)) {
    // alow a row to be shown on the map 
    props_map_data  = [props_map_data]
  }

  const [map_data, setMapData] = useState(props_map_data)
  const [subsite_data, setSubsiteData] = useState(props.subsite_data)

  const [prior_api_options, setPriorApiOptions] = useState(props.api_options)
  const [showInfoWindow, setShowInfoWindow] =useState(false)
  const [activeMarker, setActiveMarker] = useState({})
  const [selectedPlace, setSelectedPlace]= useState({marker_data:{}})

  const [anchor, setAnchor] = useState(null);
  //const [center, setCenter] = useState({lat:"26.599674",	lng:"-81.853839"});
  const [prior_props_center, setPriorPropsCenter] = useState({lat:latitude, lng:longitude});
  const [center, setCenter] = useState();

  const context = useContext(AuthContext)

  const object_model =  useGetModel("object_types", object_type)

  const id_field = props.id_field?props.id_field:object_model.key_id
  const name_field = props.name_field?props.name_field:object_model.pretty_key_id
  const summary_field = props.summary_field?props.summary_field:object_model.summary_key
  const description_field = props.description_field?props.description_field:object_model.description_key
  const thumbnail_field = props.thumbnail_field?props.thumbnail_field:object_model.thumbnail_key
  const icon_field_model =  useGetModel("fields", object_type)[icon_type_field]
  const icon_object = icon_field_model?icon_field_model["references"]:""
  const icon_object_model = useGetModel("object_types", icon_object)
  const icon_thumbnail_field = props.icon_thumbnail_field?props.icon_thumbnsil_field:icon_object_model.thumbnail_key
  const {show_popup_summary:props_show_popup_summary=true, show_popup_thumbnail:props_show_popup_thumbnail, show_popup_description:props_show_popup_description=true} = props
  const show_popup_summary = (summary_field && props_show_popup_summary)?true:false
  const show_popup_thumbnail = (thumbnail_field && props_show_popup_thumbnail)?true:false
  const show_popup_description = (description_field && props_show_popup_description)?true:false


  if (!load_own_data && (map_data !== props_map_data)) {
      setShowInfoWindow(false)
      setMapData(props_map_data)
  }

  if (load_own_data && (!map_data ||  JSON.stringify(prior_api_options)!==JSON.stringify(api_options))) {
    api.getData(object_type, api_options, (map_data, error) => {
      setShowInfoWindow(false)
      setMapData(map_data)
      setPriorApiOptions(api_options)
    })
  }


  if (!map_data) {
    return null
  }
  // take initial center from subsite
  if (map_data && !subsite_data && context.context_id && map_center ==="subsite")  {
    api.getData("core_subsite", {id:context.context_id}, (api_subsite_data, error) => {
      if(api_subsite_data[0]) {
        setSubsiteData(api_subsite_data[0])
        if  (api_subsite_data[0].latitude && api_subsite_data[0].longitude)  {
          setCenter({lat:api_subsite_data[0][latitude_field],	lng:api_subsite_data[0][longitude_field]});
        }
      }
    })
  }
  if (map_data && map_data.length>0 && map_center === "first" && (!center || Object.keys(center).length === 0) ) {
      setCenter( {lat:map_data[0][latitude_field],	lng:map_data[0][longitude_field]} );
  }


  // Handles latitude and longitude changing from props 
  if  (latitude !== prior_props_center.latitude || longitude !== prior_props_center.longitude)  {
          setCenter({lat:latitude,	lng:longitude})
          setPriorPropsCenter({lat:latitude,	lng:longitude})
  }

  
  const handleMouseover = (props, marker, e) => {
    //setSelectedPlace(props)
    if (marker[id_field] !== activeMarker[id_field]) {
      setActiveMarker(marker)
      setSelectedPlace(props)
      setShowInfoWindow(true)
    }
  };

  const handleMarkerClick = (id, marker, e) => {
    if (onMarkerClick) {
       onMarkerClick(id, marker, e)
    }
  };

  const handleMapClick = (props, marker, e) => {
    if (onMapClick) {
        onMapClick(props, marker, e)
    }
  };

  
  const PopoverComponent = (props) => {
    const selected_marker_data = props.selected_marker_data
    if (!selected_marker_data || Object.keys(selected_marker_data).length === 0) {return null}

    let summary_field_data, description_field_data
    if (summary_cutoff && selected_marker_data[summary_field] && selected_marker_data[summary_field].length > summary_cutoff) {
      summary_field_data = selected_marker_data[summary_field].substr(0, summary_cutoff)+"..."
    } else {
      summary_field_data = selected_marker_data[summary_field]
    }

    if (description_cutoff && selected_marker_data[description_field] && selected_marker_data[description_field].length > description_cutoff) {
      description_field_data = selected_marker_data[description_field].substr(0, description_cutoff)+"..."
    } else {
      description_field_data = selected_marker_data[description_field]
    }

    return (
      <div style={{maxWidth:maxPopoverWidth}}>
       <Typography variant="subtitle1">
       {show_popup_thumbnail && <Typography >{selected_marker_data[thumbnail_field]}</Typography >}
       {selected_marker_data[name_field]}</Typography> 
       {show_popup_summary && <Typography>{summary_field_data}</Typography>}
       {show_popup_description && <Typography>{description_field_data}</Typography>}
     </div>
    )
  }

  return (
      <Fragment> 
      <Map   const containerStyle = {{position: 'absolute',  width:container_width,height: container_height}} style = {{position: 'absolute',  width: '100%', height: '100%'}} google={props.google}  onClick={handleMapClick} zoom={initial_zoom} center={center}  initialCenter={center}  mapTypeControl={false} fullscreenControl={false} streetViewControl={false}>
            {map_data.map(marker => {
              var icon
              if (marker[icon_type_field] && marker["data_"+ icon_type_field][icon_thumbnail_field]) {
                const thumbnail = JSON.parse(marker["data_"+icon_type_field][icon_thumbnail_field])
                const icon_name = thumbnail.name
                const path = thumbnail.path
                const url = get_image_url(thumbnail)
                icon = {url:url, 
                        scaledSize:{"width":20,"height":32}}
              }  else  {
                icon = ""
              }
              var position = {}
              position.lat = marker[latitude_field]
              position.lng = marker[longitude_field]
              if (!position.lat || !position.lng) {return null}
              return (
              <CustomMarker
              onMouseover={handleMouseover}
              onClick={handleMarkerClick}
              name={marker[name_field]}
              marker_data={marker}
              icon = {icon}
              id = {marker.id}
              key = {marker.id}
              position={position}></CustomMarker>
              )
            })}
            <InfoWindow
               marker={activeMarker}
               visible={showInfoWindow}>
              <PopoverComponent selected_marker_data={selectedPlace.marker_data}/>
           </InfoWindow>         
        </Map>
      </Fragment>
    )
  }


export default GoogleApiWrapper({
  apiKey: google_map.get_key()
})(ACSMap)