import React, {Component} from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from "material-ui/es/styles/MuiThemeProvider";
import TextField from "material-ui/es/TextField/TextField";
import withStyles from "material-ui/es/styles/withStyles";
import purple from "material-ui/es/colors/purple";
import createMuiTheme from "material-ui/es/styles/createMuiTheme";
import green from "material-ui/es/colors/green";

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    margin: {
        margin: theme.spacing.unit,
    },
    cssLabel: {
        '&$cssFocused': {
            color: purple[500],
        },
    },
    cssFocused: {},
    cssUnderline: {
        '&:after': {
            backgroundColor: purple[500],
        },
    },
    searchIcon: {
        fontSize: '36px',
        verticalAlign: "middle"
    }
});

const theme = createMuiTheme({
    palette: {
        primary: green,
    },
});

class Search extends Component {
    constructor(props) {
        super(props);

        this.state = {
            inputValue: []
        };

        this.onInputChange = this.onInputChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.doSearch = this.doSearch.bind(this);
    }

    onInputChange(event) {
        this.setState({
            inputValue: event.target.value
        });
    }

    handleSearch() {
        let phrase = this.state.inputValue;
        this.props.setState(phrase);
    }

    doSearch(e) {
        if (e.key === "Enter") {
            this.handleSearch();
        }
    }

    render() {
        const {classes} = this.props;

        return (
            <div>
                <MuiThemeProvider theme={theme}>
                    <TextField
                        className={classes.margin}
                        label="What are you looking for?"
                        id="mui-theme-provider-input"
                        InputProps={{
                            value: this.state.inputValue,
                            onChange: this.onInputChange,
                            onKeyUp: this.doSearch
                        }}
                    />
                    <i className={["material-icons", classes.searchIcon].join(" ")}
                       onClick={this.handleSearch}>image_search</i>
                </MuiThemeProvider>
            </div>
        );
    }

}

Search.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Search);
