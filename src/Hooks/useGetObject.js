
import React, {useState, useRef, useLayoutEffect, useContext, useEffect} from 'react';
import AuthContext from '../Modules/User/AuthContext';

import * as api from '../Utils/data.js';
import * as meta from '../Utils/meta.js';
import * as log from '../Utils/log.js';
import * as u from '../Utils/utils.js';


//  const [db_object_data, setDbResults] = useState();
const useGetObject = (object_type, id, field_list, api_options={}, param_data, onData) => {
  // XX - think not neeed
  let param_data_exists = false
  if (param_data && Object.keys(param_data).length >0 ) {
      param_data_exists = true
  }

  const [ready, setReady] = useState(false);
  // changes that would trigger a new db call (except param_data, only care if it exists)
  const [prev_state, setState] = useState([false, object_type, id, field_list, api_options, param_data_exists, param_data]);
  const isMountedRef = useRef(null);
  const context = useContext(AuthContext)
  const dirty_data = context?context.dirty_stamp:""

  const [data_ready, prev_object_type, prev_id, prev_field_list, prev_api_options, prev_param_data_exists, output_data] = prev_state


  api_options.user_id = api_options.user_id?api_options.user_id:(context?context.user.id:"") 
  api_options.subsite_id = api_options.subsite_id?api_options.subsite_id:(context?context.context_id:"")


  let trigger_change_array = [object_type, id, dirty_data, param_data_exists]
  trigger_change_array = api.addAPIParams(trigger_change_array, api_options)

  useLayoutEffect( () => {

      isMountedRef.current = true;
      if (!param_data && (object_type && (id||api_options.filter_id||api_options.get_count))) {
        api.getData (object_type, Object.assign({id:id},api_options), (results, error) => {  
          if (isMountedRef.current) {
            if (error) {
                alert ("error retrieving object " + object_type + " " + id + ":" + error.message)
            } else {
              if (results === "ERROR") {
                alert ("database error")
                return {}
              }
              results = results[0]
              if (onData) {
                  onData(results)
              }
              setState([true, object_type, id, field_list, api_options, param_data_exists, results])
            }
          }
        })
      } else if (!param_data && object_type) {
          setState([true, object_type, id, field_list, api_options, false, undefined])
      }

    return () => isMountedRef.current = false;
}, trigger_change_array);
//https://reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables - Should I use one or more States
// WE NEED TO USE ONE because we want the data and the metadata
// model to match. Otherwise, we will have a lot of weird debuggs
// and flickering
  if (output_data || !prev_state) {
<<<<<<< HEAD
    if (id !== prev_id || (param_data_exists && (param_data !== output_data)) || (object_type !== prev_object_type) || (param_data_exists !== prev_param_data_exists) || (JSON.stringify(field_list) !== JSON.stringify(prev_field_list))) {
=======
    if (id !== prev_id || param_data !== output_data || (object_type !== prev_object_type) || (param_data_exists !== prev_param_data_exists) || (JSON.stringify(field_list) !== JSON.stringify(prev_field_list))) {
>>>>>>> fc835b68ee630b2848e52961610b4fd26bd5d349
        setState([true, object_type, id, field_list, api_options, param_data_exists, param_data])
    }
    return [true, object_type, id, field_list, api_options,  output_data]
  } 
  // subtle use case example
  // menu has the same component twice but with 2 different
  // object types.  The whole DOM structure is going to change
  // so don't run render with the meta data from one object
  // type on data from another.  A mess of subtle bugs
  if (object_type != prev_object_type || field_list != prev_field_list || id !== prev_id || param_data_exists !== prev_param_data_exists) { /// OR something else is different 
      if(prev_state[0]) {
        setState([false, object_type, prev_id, prev_field_list, prev_api_options, prev_param_data_exists, output_data])
      }
    return [false, prev_object_type, prev_id, prev_field_list, prev_api_options, output_data]
  } else {
    return [true, prev_object_type, prev_id, prev_field_list, prev_api_options, output_data]
  }
}

export default useGetObject;