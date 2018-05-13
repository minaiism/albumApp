import React, {Component} from 'react';
import PropTypes from "prop-types";
import {withStyles} from "material-ui/styles";
import Grid from "material-ui/Grid";
import Results from "./Results";

const styles = theme => ({
    root: {
        display: "inline-block"
    },
    demo: {
        height: 240
    },
    paper: {
        padding: theme.spacing.unit * 2,
        height: "100%",
        color: theme.palette.text.secondary
    }
});

class LayoutGrid extends Component {

    constructor(props) {
        super(props);

        this.state = {
            favorites: [],
            items: []
        };

        this.addFavorite = this.addFavorite.bind(this);
        this.removeFavorite = this.removeFavorite.bind(this);
        this.updateItem = this.updateItem.bind(this);
        this.setItems = this.setItems.bind(this);
    }

    addFavorite(item) {
        const favs = [...this.state.favorites];

        if (favs.filter(i => i.id === item.id).length > 0) {
            return;
        }

        favs.push(item);
        this.setState({
            favorites: favs
        });
    }

    removeFavorite(id) {
        let favs = [...this.state.favorites];
        let index = favs.findIndex(item => item.id === id);
        favs.splice(index, 1);

        this.setState({
            favorites: favs
        });
    }

    updateItem(newItem) {
        let items = [...this.state.items];
        items.forEach(item => {
            if (item.id === newItem.id) {
                Object.assign(item, newItem);
            }
        });
        this.setState({
            items: items
        });
    }

    setItems(items) {
        this.setState({
            items: items
        });
    }

    render() {
        const {classes} = this.props;
        const {alignItems, direction, justify} = {
            direction: "row",
            justify: "space-around",
            alignItems: "center"
        };

        return (
            <Grid container className={classes.root}>
                <Grid item xs={12}>
                    <Grid
                        container
                        spacing={16}
                        className={classes.demo}
                        alignItems={alignItems}
                        direction={direction}
                        justify={justify}
                    >
                        <Grid key="Search results" item>
                            <Results title={"Search results: " + this.props.phrase} phrase={this.props.phrase}
                                     items={this.state.items}
                                     addFavorite={this.addFavorite} removeFavorite={this.removeFavorite}
                                     updateItem={this.updateItem} favorites={this.state.favorites}
                                     setItems={this.setItems}/>
                        </Grid>
                        <Grid key="Favorite" item>
                            <Results title={"Favorites"} items={this.state.items} updateItem={this.updateItem}
                                     favorites={this.state.favorites}
                                     removeFavorite={this.removeFavorite}/>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

LayoutGrid.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LayoutGrid);
