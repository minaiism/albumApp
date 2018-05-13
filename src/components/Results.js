import React, {Component} from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Grid from "material-ui/es/Grid/Grid";
import Paper from "material-ui/es/Paper/Paper";
import GridList from "material-ui/es/GridList/GridList";
import GridListTile from "material-ui/es/GridList/GridListTile";
import Subheader from 'material-ui/List/ListSubheader';

import Flickr from 'flickr-sdk';
import Tooltip from "material-ui/es/Tooltip/Tooltip";
import IconButton from "material-ui/es/IconButton/IconButton";
import ToggleIcon from 'material-ui-toggle-icon';
import LikeIcon from "./LikeIcon";

const API_KEY = process.env.REACT_APP_API_KEY;

const flickr = new Flickr(API_KEY);

const styles = theme => ({
    root: {
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        backgroundColor: theme.palette.background.paper,
        overflow: 'hidden',
        flexGrow: 1
    },
    gridList: {
        width: 330,
        height: 600,
    },
    item: {
        height: "100%",
        width: "100%",
        textDecoration: "none",
        border: "none"
    },
    gridItem: {
        padding: "20px"
    },
    likeIcon: {
        float: "center"
    }
});

class SearchResults extends Component {
    constructor(props) {
        super(props);

        this.state = {
            downloadMore: true,
            pageToDownload: 1,
            lastPage: false
        };

        this.loadMore = this.loadMore.bind(this);
        this.handleLike = this.handleLike.bind(this);
        this.getLike = this.getLike.bind(this);
    }

    static async fetchImages(photoId) {
        return await flickr.photos.getSizes({
            photo_id: photoId
        });
    }

    loadMore() {
        this.setState({
            downloadMore: true
        });
    }

    handleLike(id) {
        let items = [...this.props.items];
        let index = items.findIndex(item => item.id === id);

        if (index === -1) {
            return this.props.removeFavorite(id);
        }

        items[index].like = !items[index].like;
        this.props.updateItem(items[index]);

        if (items[index].like) {
            this.props.addFavorite(items[index]);
        } else {
            this.props.removeFavorite(items[index].id);
        }
    }

    getLike(id) {
        return this.props.favorites.filter(favItem => favItem.id === id).length > 0;
    }

    loadItems(page) {
        this.setState({
            downloadMore: false
        });

        if (this.state.lastPage) {
            return;
        }

        const self = this;

        flickr.photos.search({
            text: this.props.phrase,
            page: this.state.pageToDownload,
            per_page: 30
        }).then(res => {
            if (page >= res.body.photos.pages) {
                self.setState({
                    downloadMore: false,
                    lastPage: true
                });
            } else {
                let nextPage = this.state.pageToDownload + 1;

                self.setState({
                    pageToDownload: nextPage
                })
            }

            let items = [...self.props.items];
            let itemsLengthBefore = items.length;
            let currentPagePhotos = [...res.body.photos.photo];
            let imagesToFetchCounter = itemsLengthBefore + currentPagePhotos.length;

            currentPagePhotos.forEach(photo => {
                SearchResults.fetchImages(photo.id).then(response => {
                    if (response.body.sizes.size.filter(size => size.width === "150").length < 1) {
                        imagesToFetchCounter--;
                    } else {
                        response.body.sizes.size.forEach(size => {
                            if (size.width === "150") {
                                items.push({
                                    id: photo.id,
                                    title: photo.title,
                                    owner: photo.owner,
                                    source: size.source,
                                    url: size.url,
                                    like: self.getLike(photo.id)
                                });
                            }
                        });
                    }
                }).catch(err => {
                    console.log("Cannot get photo: " + photo.id + ". " + err);
                    imagesToFetchCounter--;
                }).finally(() => {
                    if (items.length === imagesToFetchCounter) {
                        this.props.setItems(items);

                        self.setState({
                            downloadMore: false
                        });
                    }
                });
            });
        }).catch(err => {
            console.log("Cannot search photos: " + err);
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.phrase !== prevProps.phrase) {
            this.props.setItems([]);

            this.setState({
                downloadMore: true,
                pageToDownload: 1
            });
        }
    }

    render() {
        const {classes} = this.props;

        const REMOVE_HINT = "Naah!";

        let self = this;

        let renderItems = [];

        // if phrase exists then render Favorites list
        if (!this.props.phrase) {
            this.props.favorites.forEach((item, i) => {
                renderItems.push(
                    <div className="item" key={i}>
                        <a href={item.url} target="_blank">
                            <img className={classes.itemImage} src={item.source} width="150" height="150"
                                 title={item.title + " by " + item.owner}
                                 alt="missing thumbnail"/>
                        </a>
                        <Tooltip title={REMOVE_HINT} placement="left-start">
                            <IconButton className={classes.likeIcon}
                                        onClick={() => {
                                            self.handleLike(item.id)
                                        }}
                            >
                                <LikeIcon iconValue={"favorite"}/>
                            </IconButton>
                        </Tooltip>
                    </div>
                );
            });

            return (
                <div className={classes.root}>
                    <GridList cellHeight={200} className={classes.gridList}>
                        <GridListTile key="Subheader" cols={2}
                                      style={{height: 'auto', position: 'sticky', top: 0, backgroundColor: 'white'}}>
                            <Subheader component="div">{this.props.title}</Subheader>
                        </GridListTile>
                        {renderItems.map(item => (
                            <Grid className={classes.gridItem} key={Math.random()} item>
                                <Paper className={classes.paper}>{item}</Paper>
                            </Grid>
                        ))}
                    </GridList>
                </div>
            );
        }

        // Otherwise, return Search results list:

        const loader = <div key={Math.random()} className="loader"/>;

        this.props.items.forEach((item, i) => {
            let hint = "";

            if (!item.like) {
                hint = "I like it";
            } else {
                hint = REMOVE_HINT;
            }

            renderItems.push(
                <div className="item" key={i}>
                    <a href={item.url} target="_blank">
                        <img className={classes.itemImage} src={item.source} width="150" height="150"
                             title={item.title + " by " + item.owner}
                             alt="missing thumbnail"/>
                    </a>
                    <Tooltip title={hint} placement="left-start">
                        <IconButton className={classes.likeIcon}
                                    onClick={() => {
                                        self.handleLike(item.id);
                                    }}
                        >
                            <ToggleIcon
                                on={item.like}
                                offIcon={
                                    <LikeIcon iconValue={"favorite_border"}/>
                                }
                                onIcon={
                                    <LikeIcon iconValue={"favorite"}/>
                                }
                            />
                        </IconButton>
                    </Tooltip>

                </div>
            );
        });

        let loadMoreItem = () => {
            if (!this.state.lastPage && !this.state.downloadMore) {
                return (<Grid className={classes.gridItem} key={Math.random()} item>
                    <Paper className={classes.paper}>
                        {
                            <button onClick={this.loadMore} style={{height: "150px", width: "150px"}}>View more
                            </button>
                        }
                    </Paper>
                </Grid>);
            }
        };

        return (
            <InfiniteScroll
                pageStart={0}
                loadMore={this.loadItems.bind(this)}
                hasMore={this.state.downloadMore}
                loader={loader}>
                <div className={classes.root}>
                    <GridList cellHeight={200} className={classes.gridList}>
                        <GridListTile key="Subheader" cols={2}
                                      style={{height: 'auto', position: 'sticky', top: 0, backgroundColor: 'white'}}>
                            <Subheader component="div">{this.props.title}</Subheader>
                        </GridListTile>
                        {renderItems.map(item => (
                            <Grid className={classes.gridItem} key={Math.random()} item>
                                <Paper className={classes.paper}>{item}</Paper>
                            </Grid>
                        ))}
                        {loadMoreItem()}

                    </GridList>
                </div>
            </InfiniteScroll>
        );
    }
}

SearchResults.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SearchResults);
