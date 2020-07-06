import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React, {Fragment,useLayoutEffect, useState, useContext} from 'react';
import {Typography, Button} from '@material-ui/core';
import AuthContext from './AuthContext';
import LoginForm from './LoginForm'
import * as auth from '../../Utils/auth.js'
import * as meta from '../../Utils/meta.js';
import * as u from '../../Utils/utils.js'
import useGetModel from '../../Hooks/useGetModel.js'

function Auth(props) {
  let {auth_scope="", auth_priv="", auth_action="read", object_type, prompt_login=true} = props
  // for safety making this explicit instead of defaulting
  if (["view","csv","list"].includes(auth_action)) {auth_action="read"}
  const [login_form, setLoginForm] = useState(false)
  const object_type_meta = useGetModel("object_types", object_type)
  const app_params  = useGetModel("app_params")
  const context = useContext(AuthContext)

  function handleLogin() {
      setLoginForm(false)
  }

  function handleClose(event) {
    if (props.onClose) {
        props.onClose()
    }
  }

  if (!auth_priv) {
    let auth_action_privs = app_params.auth_action_privs.site_default
    if (object_type) {        
        auth_action_privs = object_type_meta.auth_action_privs
    } 
    const auth_and_scope = auth_action_privs[auth_action].split("_")
    auth_scope = auth_and_scope[0]
    auth_priv = auth_and_scope[1]
  } else {
    if (!auth_scope) {
      if (object_type && object_type_meta.with_context) {
        auth_scope = "context"
      } else {
        auth_scope = "site"
      }
    }
  }

  let show_children = true

//  u.aa("object_type, action, auth_scope, auth_priv, context_id, user", object_type, auth_action, auth_scope, auth_priv, context.context_id, context.user.id)

  if (auth_priv !== "public") {
        if (!context.user ) {
          show_children = false
         if (!login_form && prompt_login) {

             setLoginForm(true)
         }    
       }
  }
  
  const authorized = auth.authorized({context_id:context.context_id, user:context.user}, auth_scope, auth_priv)
  if (login_form && !context.user) {
    return ( 
      <LoginForm open={login_form} onLogin={handleLogin} onClose={handleClose}/>
           )
  } else if (authorized && props.onAuthorized) {
      props.onAuthorized()
      return null
  } else if (authorized && show_children) {
    return (
      <Fragment>{props.children}</Fragment>
          )
  } else if (!authorized && show_children) {
      // normal navigation would not reach here
          if (props.handleClose) {
            props.handleClose()
          }
          return null
  } else {
    // should not reach here by logic
            return null
  }    
  
}
export default Auth;
