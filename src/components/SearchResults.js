import React, {Component} from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import Qwest from 'qwest';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import './SearchResults.css';
import Grid from "material-ui/es/Grid/Grid";
import Paper from "material-ui/es/Paper/Paper";
import GridList from "material-ui/es/GridList/GridList";
import GridListTile from "material-ui/es/GridList/GridListTile";
import Subheader from 'material-ui/List/ListSubheader';

const api = {
    baseUrl: 'https://api.soundcloud.com',
    client_id: 'caf73ef1e709f839664ab82bef40fa96'
};

const styles = theme => ({
    root: {
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        width: 500,
        height: 450,
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },
    title: {
        marginBottom: "10px"
    },
});

class SearchResults extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tracks: [],
            hasMoreItems: true,
            nextHref: null
        };
    }

    loadItems(page) {
        let self = this;

        let url = api.baseUrl + '/users/8665091/favorites';
        if (this.state.nextHref) {
            url = this.state.nextHref;
        }

        Qwest.get(url, {
            client_id: api.client_id,
            linked_partitioning: 1,
            page_size: 10
        }, {
            cache: true
        })
            .then(function (xhr, resp) {
                if (resp) {
                    let tracks = self.state.tracks;
                    resp.collection.map((track) => {
                        if (track.artwork_url == null) {
                            track.artwork_url = track.user.avatar_url;
                        }

                        return tracks.push(track);
                    });

                    if (resp.next_href) {
                        self.setState({
                            tracks: tracks,
                            nextHref: resp.next_href
                        });
                    } else {
                        self.setState({
                            hasMoreItems: false
                        });
                    }
                }
            });
    }

    render() {
        const {classes} = this.props;
        const loader = <div key={Math.random()} className="loader">Loading ...</div>;

        let items = [];

        this.state.tracks.map((track, i) => {
            return items.push(
                <div className="track" key={i}>
                    <a href={track.permalink_url} target="_blank">
                        <img src={track.artwork_url} width="150" height="150" alt="missing thumbnail"/>
                        <p className={classes.title}>{track.title}</p>
                    </a>
                </div>
            );
        });

        return (
            <InfiniteScroll
                pageStart={0}
                loadMore={this.loadItems.bind(this)}
                hasMore={this.state.hasMoreItems}
                loader={loader}>
                <div className={classes.root}>
                    <GridList cellHeight={180} className={classes.gridList}>
                        <GridListTile key="Subheader" cols={2} style={{height: 'auto'}}>
                            <Subheader component="div">December</Subheader>
                        </GridListTile>
                        {items.map(item => (
                            <Grid key={Math.random()} item>
                                <Paper className={classes.paper}>{item}</Paper>
                            </Grid>
                        ))}
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
