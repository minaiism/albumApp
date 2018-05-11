import React, {Component} from 'react';
import './App.css';
import Search from "./components/Search";
import TitleBar from "./components/TitleBar";
import LayoutGrid from "./components/LayoutGrid";

import Flickr from 'flickr-sdk';

const API_KEY = process.env.REACT_APP_API_KEY;

const flickr = new Flickr(API_KEY);

class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <TitleBar/>
                </header>
                <div>
                    <Search flickr={flickr}/>
                    <br/>
                    <br/>
                    <LayoutGrid flickr={flickr}/>
                </div>
            </div>
        );
    }
}

export default App;
