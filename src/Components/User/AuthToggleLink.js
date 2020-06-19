import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../Utils/utils.js'
import React, {Fragment} from 'react';
import {Typography, Button, IconButton} from '@material-ui/core';
import ACSImage from "../../Functional/Fields/ACSImage.js"
import AuthContext from './AuthContext';
import LoginForm from './LoginForm'

class AuthToggleLink extends React.Component {
    constructor(props) {
      super(props);  
      this.state = {
          login_form:false 
      };
      this.handleLogin = this.handleLogin.bind(this);
      this.handleClose = this.handleClose.bind(this);
    }
  handleLogin(event) {
    this.setState({login_form:true})
  }

  handleClose(event) {
    this.setState({login_form:false})
  }

  render() {
    if (this.context.user) {
      return (
        <Fragment>

          <Button color="inherit" onClick={this.context.logout}> Logout</Button>
          <ACSImage image_object={this.context.user.thumbnail} letters={this.context.user.initials} size="small"  />
  
        </Fragment>
      )
    } else {
      return (
        <Fragment>
            <Button onClick={this.handleLogin}
            color="inherit">Login</Button>
            {this.state.login_form  &&
              <LoginForm
                open={this.state.login_form}
                onClose={this.handleClose}
             />}
        </Fragment>
      )
    }
  }
}
AuthToggleLink.contextType = AuthContext;
export default AuthToggleLink;
