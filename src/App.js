import React, {Component} from 'react';
import './App.css';
import Search from "./components/Search";
import TitleBar from "./components/TitleBar";
import LayoutGrid from "./components/LayoutGrid";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            phrase: "dog"
        };

        this.setPhrase = this.setPhrase.bind(this);
    }

    setPhrase(newPhrase) {
        this.setState({
            phrase: newPhrase
        });
    }

    render() {
        return (
            <div className="App">
                    <TitleBar/>
                <div>
                    <Search setState={this.setPhrase}/>
                    <br/>
                    <br/>
                    <LayoutGrid phrase={this.state.phrase}/>
                </div>
            </div>
        );
    }
}

export default App;
