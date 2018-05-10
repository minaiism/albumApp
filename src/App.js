import React, {Component} from 'react';
import './App.css';
import Search from "./components/Search";
import TitleBar from "./components/TitleBar";

class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <TitleBar/>
                </header>
                <div>
                    <Search/>
                </div>
            </div>
        );
    }
}

export default App;
