import React, { Component } from "react";
import './Profile.css';
import { URLConfiguration } from "../../assets/APIdetails";
import { UserInfo } from "../../assets/UserInfo";
import Header from '../../common/header/Header';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import userProfilePicture from "../../assets/userProfilePicture.jpeg";
import Avatar from '@material-ui/core/Avatar';
import Modal from '@material-ui/core/Modal';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import CardMedia from '@material-ui/core/CardMedia';
import FavoriteIconBorder from '@material-ui/icons/FavoriteBorder';
import FavoriteIconFill from '@material-ui/icons/Favorite';


const styles = {

    postsStyle: {
        height: '300px',
        paddingTop: '30%', 
    },

    hashtagStyle: {
      color: '#2fc3e0'
    },

    editModal: {
        position: 'relative',
        width: "180px",
        backgroundColor: "white",
        top: "28%",
        padding: "2%",
        margin: "0 auto"
    }
    
};


class Profile extends Component {

    constructor(props) {
        super(props);
        // If user is not logged in, they are sent back to the login section
        if (sessionStorage.getItem('access-token') == null) {
            props.history.replace('/');
        }

        this.state = {
            username: null,
            fullName: null,
            profilePicture: null,
            posts: null,
            following: null,
            followers: null,
            editOpen: false,
            currentPost: null,
            fullNameRequired: 'dispNone',
            updatedFullName: '',
            postsData: null,
            imageModalOpen: false,
            likeSet: new Set(),
            comments: {}
        }
    }

    getPostDetails = () => {
        let that = this;
        let url = `${URLConfiguration.allMediaUrl}&access_token=${sessionStorage.getItem('access-token')}`;
        fetch(url, {
            method: 'GET',
        }).then(response => response.json()
        ).then((jsonResponse) => {
            that.setState({
                profilePicture: userProfilePicture,
                username: sessionStorage.getItem('username'),
                following: UserInfo.following,
                followers: UserInfo.followers,
                posts: UserInfo.totalPosts,
                postsData: jsonResponse.data,
                fullName: UserInfo.fullName
            });
        }).catch((error) => {
            console.log('Error in getting posts', error);
        });
    }

    componentDidMount() {
        this.getPostDetails();
    }

    openEditModalHandler = () => {
        this.setState({ editOpen: true });
    }

    closeEditModalHandler = () => {
        this.setState({ editOpen: false });
    }

    openImageModalHandler = (event) => {
        var image = this.state.postsData.find(item => {
            return item.id === event.target.id
        })
        image.likes = {
          count: Math.round(Math.random() * 250) + 12
        }
        this.setState({ imageModalOpen: true, currentPost: image });
    }

    closeImageModalHandler = () => {
        this.setState({ imageModalOpen: false });
    }

    fullNameChangeHandler = (e) => {
        this.setState({
          updatedFullName: e.target.value
        })
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

    updateClickHandler = () => {
        if (this.state.updatedFullName === '') {
            this.setState({ fullNameRequired: 'dispBlock'})
        } else {
            this.setState({ fullNameRequired: 'dispNone' })
        }

        if (this.state.updatedFullName === "") { return }

        this.setState({
            fullName: this.state.updatedFullName
        })

        this.closeEditModalHandler()
    }

    commentChangeHandler = (e) => {
      this.setState({
        currentComment:e.target.value
      });
    }

    logout = () => {
      sessionStorage.clear();
      this.props.history.replace('/');
    }

    likeButtonHandler = (id) =>{
      var foundPost = this.state.currentPost;
      if (typeof foundPost !== undefined) {
        if (!this.state.likeSet.has(id)) {
          foundPost.likes.count++;
          this.setState(({likeSet}) => ({
            likeSet:new Set(likeSet.add(id))
          }))
        }else {
          foundPost.likes.count--;
          this.setState(({likeSet}) =>{
            const newLike = new Set(likeSet);
            newLike.delete(id);

            return {
              likeSet:newLike
            };
          });
        }
      }
    }


    render() {
        let postsData = this.state.postsData;
        let hashtags = [];
        return (
            <div>
                <Header section = {"Profile"} userProfileUrl = {userProfilePicture} logoutHandler = {this.logout}/>
                <div className = "user-details">
                    <Avatar
                        alt="User's Profile Picture"
                        src = {userProfilePicture} 
                        style={{width: "80px", height: "80px", marginRight: '2%'}}
                    />
                    <span style={{marginLeft: "20px"}}>
                        <div style={{width: "600px", fontSize: "x-large"}}> {this.state.username} <br /> 
                            <div style = {{ marginTop:"2%", float: "left", width: "200px", fontSize: "medium"}}> Posts: {this.state.posts} </div>
                            <div style = {{ marginTop:"2%", float: "left", width: "200px", fontSize: "medium"}}> Follows: {this.state.following} </div>
                            <div style = {{ marginTop:"2%", float: "left", width: "200px", fontSize: "medium"}}> Followed By: {this.state.followers}</div> <br />
                        </div>
                        <br />
                        <div style = {{fontSize: "large"}}> {this.state.fullName}
                        <Button mini color="secondary" variant = "fab" aria-label="Edit" style = {{ backgroundColor: "#ff5050",  borderRadius: "50%", marginLeft: "25px"}} onClick = {this.openEditModalHandler}>
                            <EditIcon/>
                        </Button>
                        </div>
                        <Modal aria-labelledby = "edit-modal" aria-describedby = "Modal used for updating full name" open = { this.state.editOpen } onClose = { this.closeEditModalHandler } style = {{ alignItems: 'center', justifyContent: 'center' }} >
                            <div style={styles.editModal}>
                                <Typography variant="h5" id="modal-title">
                                    Edit
                                </Typography><br />
                                <FormControl required>
                                    <InputLabel htmlFor = "fullname">Full Name</InputLabel>
                                    <Input id = "fullname" onChange = {this.fullNameChangeHandler} />
                                    <FormHelperText className = {this.state.fullNameRequired}><span className = "red">required</span></FormHelperText>
                                </FormControl><br /><br /><br />
                                <Button variant = "contained" color = "primary" onClick = {this.updateClickHandler}> UPDATE </Button>
                            </div>
                        </Modal>
                    </span>
                </div>
                {this.state.postsData != null &&
                    <GridList cellHeight = {'auto'} cols = {3} style = {{ padding: "40px" }}>
                        {postsData && postsData.map(media => (
                            <GridListTile key = {media.id} style = {{cursor: "pointer"}}>
                                <CardMedia id = {media.id} image={media.media_url} title = {media.caption} style = {styles.postsStyle} onClick = {this.openImageModalHandler} />
                            </GridListTile>
                        ))}

                    </GridList>
                }
                {this.state.currentPost != null &&
                <Modal
                    aria-labelledby = "image-modal"
                    aria-describedby = "Modal displaying Instagram post"
                    open={this.state.imageModalOpen}
                    onClose = {this.closeImageModalHandler}
                    style = {{display:'flex',justifyContent:'center',alignItems:'center'}}>
                    <div style = {{display:'flex',flexDirection:'row',backgroundColor: "#fff",width:'70%',height:'70%'}}>
                      <div style = {{width:'50%',padding:10}}>
                        <img style = {{height:'100%',width:'100%'}}
                          src = {this.state.currentPost.media_url}
                          alt = {this.state.currentPost.caption} />
                      </div>

                      <div style = {{display:'flex', flexDirection:'column', width:'50%', padding:10}}>
                        <div style = {{borderBottom:'2px solid #f2f2f2',display:'flex', flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                          <Avatar
                            alt = "User's Profile Picture"
                            src = {userProfilePicture}
                            style = {{width: "50px", height: "50px",margin:'10px'}}/>
                            <Typography component="p">
                              {this.state.username}
                            </Typography>
                        </div>
                        <div style = {{display:'flex', height:'100%', flexDirection:'column', justifyContent:'space-between'}}>
                          <div>
                            <Typography component = "p"> {this.state.currentPost.caption} </Typography>
                            <Typography style={styles.hashtagStyle} component="p" >
                              {hashtags.join(' ')}
                            </Typography>
                            {this.state.comments.hasOwnProperty(this.state.currentPost.id) && this.state.comments[this.state.currentPost.id].map((comment, index)=>{
                              return(
                                <div key = {index} className = "row">
                                  <Typography component = "p" style = {{fontWeight:'bold'}}>
                                    {sessionStorage.getItem('username')}:
                                  </Typography>
                                  <Typography component = "p" >
                                    {comment}
                                  </Typography>
                                </div>
                              )
                            })}
                          </div>
                          <div>

                            <div className = "row">
                              <IconButton aria-label = "Like this post" onClick = {this.likeButtonHandler.bind(this, this.state.currentPost.id)}>
                                {this.state.likeSet.has(this.state.currentPost.id) && <FavoriteIconFill style = {{color:'red'}}/>}
                                {!this.state.likeSet.has(this.state.currentPost.id) && <FavoriteIconBorder/>}
                              </IconButton>
                              <Typography component = "p">
                                {
                                  this.state.currentPost.likes.count === 1 ?
                                    <span> {this.state.currentPost.likes.count} like </span> : <span> {this.state.currentPost.likes.count} likes </span>
                                }
                              </Typography>
                            </div>

                            <div className = "row">
                              <FormControl style = {{flexGrow:1}}>
                                <InputLabel htmlFor = "comment">Add Comment</InputLabel>
                                <Input id = "comment" value = {this.state.currentComment} onChange = {this.commentChangeHandler}/>
                              </FormControl>
                              <FormControl>
                                <Button onClick = {this.addCommentClickHandler.bind(this,this.state.currentPost.id)} variant = "contained" color = "primary">
                                  ADD
                                </Button>
                              </FormControl>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>
                </Modal>}
            </div>
        );
    }
}

export default Profile;

