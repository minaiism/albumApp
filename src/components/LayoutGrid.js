import React, {Component} from 'react';
import PropTypes from "prop-types";
import {withStyles} from "material-ui/styles";
import Grid from "material-ui/Grid";
import SearchResults from "./SearchResults";

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
                            <SearchResults flickr={this.props.flickr}/>
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
