import React, { Component } from "react";
import Header from '../../common/header/Header';
import './Home.css';
import userProfilePicture from "../../assets/userProfilePicture.jpeg";
import { URLConfiguration } from "../../assets/APIdetails";
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardHeader from '@material-ui/core/CardHeader';
import Container from '@material-ui/core/Container';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { UserInfo } from "../../assets/UserInfo";


class Home extends Component {
    constructor(props) {
        super(props);
        if (sessionStorage.getItem('access-token') == null) {
            props.history.replace('/');
        }
        this.state = {
            profilePicture: null,
            likeSet: new Set(),
            comments: {},
            currrentComment: "",
            filteredData: [],
            userInfo: [{}],
            imageDetails: [],
        }
    }

    logout = () => {
        sessionStorage.clear();
        this.props.history.replace('/');
    }

    myAccount = () => {
        this.props.history.replace('/profile');
    }

    addCommentClickHandler = (id) => {
        if (this.state.currentComment === "" || typeof this.state.currentComment === undefined) {
          return;
        }
        let commentList = this.state.comments.hasOwnProperty(id)?
          this.state.comments[id].concat(this.state.currentComment): [].concat(this.state.currentComment);
        this.setState({
          comments:{
            ...this.state.comments,
            [id]: commentList
          },
          currentComment:''
        })
    }

    async componentDidMount() {
        let userInfo = URLConfiguration.allMediaUrl + "&access_token=" + sessionStorage.getItem("access-token");
        let imageDetails = URLConfiguration.baseUrl + "/$mediaId?fields=id,media_type,media_url,username,timestamp&access_token=" + sessionStorage.getItem("access-token");
        let response = await fetch(userInfo);
        let postsData = await response.json();
        postsData = postsData.data;
        for (let it = 0; it < postsData.length; it++) {
            response = await fetch(imageDetails.replace('$mediaId', postsData[it].id));
            let post = await response.json();
            postsData[it].index = it;
            postsData[it].media_url = post.media_url;
            postsData[it].username = post.username;
            postsData[it].timestamp = post.timestamp;
            postsData[it].tags = UserInfo.tags; 
        }
        this.setState({ userImages: postsData });
        this.setState({ filteredData: postsData.filter(details => true) });  
    }

    render() {
        return (
            <div>
                <Header title = "Image Viewer" section = "Home" userProfileUrl = {userProfilePicture} logoutHandler = {this.logout} accountHandler = {this.myAccount}/>    
                <Container className = 'posts-container'>
                        <Grid container justify = 'flex-start' direction = 'row' alignContent = 'center' spacing = {3}>
                            {
                                (this.state.filteredData || []).map((post) => (
                                    <Grid item xs = {6} key = { post.id }>
                                        <Card key={ post.id } >
                                            <CardHeader avatar = { <Avatar variant = "circle" src = { userProfilePicture } /> }
                                                title = {post.username}
                                                subheader = { new Date(post.timestamp).toLocaleString().replace(",", "") } />
                                            <CardMedia image = { post.media_url } style = {{ paddingTop: '100%' }} />
                                            <Divider />
                                            <CardContent>
                                                <div> {post.caption} </div> <br />
                                                <div className='hashtags'> {post.tags} </div> <br />
                                            </CardContent>
                                        </Card>
                                        </Grid>
                                ))
                            }
                        </Grid>
                    </Container>
            </div>
        );
    }
}

export default Home;