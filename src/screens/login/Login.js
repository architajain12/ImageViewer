import React,{ Component } from 'react';
import Header from '../../common/header/Header';
import { Card, CardContent, Typography, FormControl, Input, InputLabel, Button, FormHelperText } from '@material-ui/core';
import './Login.css';

class Login extends Component{
    
    constructor() {
        super();
        this.state = { 
          username: "",
          usernameRequired: "dispNone",
          password: "",
          passwordRequired: "dispNone",
          incorrectCredentials: "dispNone",
          loggedIn: sessionStorage.getItem('access-token') == null ? false : true
        }
    }

    inputUsernameChangeHandler = (event) => {
       this.setState({username: event.target.value});
    }
    
    inputPasswordChangeHandler = (event) => {
        this.setState({password: event.target.value});
    }

    SignedIn = () => {
        alert('Hi, you have logged in!');
    }

    loginClickHandler = () => {
        this.setState({ incorrectCredentials: "dispNone" });
        this.state.username === "" ? this.setState({ usernameRequired: "dispBlock" }) : this.setState({ usernameRequired: "dispNone" });
        this.state.password === "" ? this.setState({ passwordRequired: "dispBlock" }) : this.setState({ passwordRequired: "dispNone" });
        
        if (this.state.username === "" || this.state.password === "") { return }

        if (this.state.username === "testUser" && this.state.password === "testUser") {
            sessionStorage.setItem('username', 'testUser');
            sessionStorage.setItem('access-token', 'IGQVJVYVhxSS1XU1R4NVYtMVdOWEhMVFhFdVJaSTI3b09qVjR1MUg2S2d1NEZABTEx0T29hRG9NVFI3ZAUE4eC1TRVZAlZAXJ4LWtWa1UySnZAWdlo1NGtNaHJLeUNTaGNFRlRaZAmVwQmFDSmhVcnlxeTk1WAZDZD');
            this.setState({ loggedIn: true });
            this.SignedIn();
        } else {
            this.setState({ incorrectCredentials: "dispBlock" });
        }
    }

    render(){
        return(
            <div>
                <Header title="Image Viewer" />
                <div className = "card-container">
                    <Card className = "login-card">
                        <CardContent>
                            <Typography variant="h5"> LOGIN </Typography><br />
                            <FormControl required>
                                <InputLabel htmlFor="username">Username</InputLabel>
                                <Input type = "text" id = "username" username = {this.state.username} onChange = {this.inputUsernameChangeHandler}></Input>
                                <FormHelperText  className = {this.state.usernameRequired}>
                                    <span className = "required-warning">required</span>    
                                </FormHelperText>
                            </FormControl> 
                            <br /><br />
                            <FormControl required>
                                <InputLabel htmlFor="password">Password</InputLabel>
                                <Input type = "password" id = "password" password = {this.state.password} onChange = {this.inputPasswordChangeHandler}></Input>
                                <FormHelperText className = {this.state.passwordRequired}>
                                    <span className = "required-warning">required</span>    
                                </FormHelperText>
                            </FormControl>
                            <br /><br /><br />
                            <div className={this.state.incorrectCredentials}><span className="red"> Incorrect username and/or password </span></div><br />
                            <Button variant="contained" color="primary" onClick={this.loginClickHandler} >LOGIN</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }
}

export default Login;