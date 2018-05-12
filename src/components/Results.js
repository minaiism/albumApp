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
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },
    item: {
        height: "100%",
        width: "100%",
        textDecoration: "none",
        border: "none"
    },
    gridItem: {
        padding: "20px"
    }
});

class SearchResults extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            hasMoreItems: true,
        };

        this.loadMore = this.loadMore.bind(this);
    }

    static async fetchImages(photoId) {
        return await flickr.photos.getSizes({
            photo_id: photoId
        });
    }

    loadMore() {
        this.setState({
            hasMoreItems: true
        });
    }

    loadItems(page) {
        const self = this;

        flickr.photos.search({
            text: this.props.phrase,
            page: page
        }).then(res => {
            if (page === res.body.photos.pages) {
                self.setState({
                    hasMoreItems: false
                });
            }

            let items = [...self.state.items];
            let itemsLengthBefore = items.length;

            let photos = [...res.body.photos.photo];

            photos.forEach(photo => {
                SearchResults.fetchImages(photo.id).then(resSizes => {
                    resSizes.body.sizes.size.forEach(size => {
                        if (size.width === "150") {
                            items.push({
                                id: photo.id,
                                title: photo.title,
                                owner: photo.owner,
                                source: size.source,
                                url: size.url,
                            });
                        }
                    });
                }).catch(err => {
                    console.log("Cannot get photo: " + photo.id + ". " + err);
                }).finally(() => {
                    if (items.length === itemsLengthBefore + photos.length) {
                        self.setState({
                            items: items,
                            hasMoreItems: false
                        });
                    }
                });
            });
        }).catch(err => {
            console.error(err);
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.phrase !== prevProps.phrase) {
            this.setState({
                items: [],
                hasMoreItems: true
            });
        }
    }

    render() {
        const {classes} = this.props;

        if (!this.props.phrase) {
            return (
                <div className={classes.root}>
                    <GridList cellHeight={180} className={classes.gridList}>
                        <GridListTile key="Subheader" cols={2} style={{height: 'auto'}}>
                            <Subheader component="div">{this.props.title}</Subheader>
                        </GridListTile>
                        {["hi", "hi"].map(item => (
                            <Grid className={classes.gridItem} key={Math.random()} item>
                                <Paper className={classes.paper}>{item}</Paper>
                            </Grid>
                        ))}
                    </GridList>
                </div>
            );
        }

        const loader = <div key={Math.random()} className="loader"/>;

        let renderItems = [];

        this.state.items.map((item, i) => {
            return renderItems.push(
                <div className="item" key={i}>
                    <a href={item.url} target="_blank">
                        <img src={item.source} width="150" height="150" title={item.title + " by " + item.owner}
                             alt="missing thumbnail"/>
                    </a>
                </div>
            );
        });

        let loadMoreItem = () => {
            if (!this.state.hasMoreItems) {
                return (<Grid className={classes.gridItem} key={Math.random()} item>
                    <Paper className={classes.paper}>{<button onClick={this.loadMore}
                                                              style={{height: "150px", width: "150px"}}>View
                        more</button>}</Paper>
                </Grid>);
            }
        };

        return (
            <InfiniteScroll
                pageStart={0}
                loadMore={this.loadItems.bind(this)}
                hasMore={this.state.hasMoreItems}
                loader={loader}>
                <div className={classes.root}>
                    <GridList cellHeight={155} className={classes.gridList}>
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
