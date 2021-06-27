import React, { Component } from "react";
import Header from '../../common/header/Header';
import './Home.css';
import userProfilePicture from "../../assets/userProfilePicture.jpeg";
import { URLConfiguration } from "../../assets/APIdetails";
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
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FavoriteBorderIcon from'@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';

class Home extends Component {
    constructor(props) {
        super(props);
        if (sessionStorage.getItem('access-token') == null) {
            props.history.replace('/');
        }
        this.state = {
            profilePicture: null,
            likeSet: new Set(),
            comments: [],
            filteredData: [],
            userInfo: [{}],
            imageDetails: [],
            imagesData: []
        }
    }

    logout = () => {
        sessionStorage.clear();
        this.props.history.replace('/');
    }

    myAccount = () => {
        this.props.history.replace('/profile');
    }

    likeButtonClickHandler = (post) => {
        let index = post.index;
        let likedImages = this.state.imagesData;
        likedImages[index].hasLiked = !likedImages[index].hasLiked;
        this.setState({ 'imagesData': likedImages })
    }

    addCommentClickHandler = (index) => {
        var textfield = document.getElementById("comment-" + index);
        if (textfield.value == null || textfield.value.trim() === "") {
            return;
        }
        let currentComment = this.state.comments;
        if (currentComment[index] === undefined) {
            currentComment[index] = [textfield.value];
        } else {
            currentComment[index] = currentComment[index].concat([textfield.value]);
        }

        textfield.value = '';
        this.setState({'comments': currentComment})
    }

    searchInputHandler = (searchInput) => {
        let filteredData = this.state.imagesData;
        filteredData = filteredData.filter((post) => {
            let string = post.caption.toLowerCase();
            let subString = searchInput.toLowerCase();
            return string.includes(subString);
        })
        this.setState({
            filteredData
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
            postsData[it].hasLiked = false;
            postsData[it].likes = Math.round(Math.random() * 250) + 12;
            postsData[it].username = post.username;
            postsData[it].timestamp = post.timestamp;
            postsData[it].tags = UserInfo.tags; 
        }
        this.setState({ filteredData: postsData.filter(details => true) });  
        this.setState({ imagesData: postsData });
    }

    render() {
        return (
            <div>
                <Header title = "Image Viewer" section = "Home" userProfileUrl = {userProfilePicture} logoutHandler = {this.logout} accountHandler = {this.myAccount} searchHandler = {this.searchInputHandler}/>    
                <Container className = 'posts-container'>
                        <Grid container justify = 'flex-start' direction = 'row' alignContent = 'center' spacing = {3}>
                            {
                                (this.state.filteredData || []).map((post, index) => (
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
                                                <div>
                                                {
                                                    this.state.comments[index] ?
                                                        (this.state.comments)[index].map((comment, index) =>
                                                        (
                                                            <p key={index}>
                                                                <strong>{post.username}</strong>: {comment}
                                                            </p>
                                                        ))
                                                        :
                                                        <p></p>
                                                }
                                                </div>

                                                <div className='likes-section'>
                                                    {
                                                        post.hasLiked ? <FavoriteIcon style={{ color: "red" }} onClick={() => this.likeButtonClickHandler(post)} /> :
                                                            <FavoriteBorderIcon onClick={() => this.likeButtonClickHandler(post)} />
                                                    }
                                                    <Typography>
                                                        <span> &nbsp;{post.hasLiked ? (post.likes + 1) + ' likes' : post.likes + ' likes'}</span>
                                                    </Typography>
                                                </div>

                                                <div className = 'comments'>
                                                    <FormControl className = 'comment-text'>
                                                        <TextField id = {'comment-' + index} label = "Add a comment"/>
                                                    </FormControl>
                                                    &nbsp;
                                                    <div>
                                                        <FormControl>
                                                            <Button variant = 'contained' color = 'primary' onClick={() => this.addCommentClickHandler(index)}>
                                                                ADD
                                                            </Button>
                                                        </FormControl>
                                                    </div>
                                                </div>
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