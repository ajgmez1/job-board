import React from 'react';
import { Route, Link } from 'react-router-dom';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = { navVisible: '', value: '' };
    }
    handleClick = () => {
        this.setState((prevState) => ({
            navVisible: prevState.navVisible ? '' : 'jb-nav-visible'
        }));
    }
    handleChange = (e) => {
        this.setState({ value: e.target.value });
    }
    render() {
        return (
            <header>
                <div className="jb-row">
                    <Link className="jb-logo" to="/">
                        <i className="fa fa-map-o fa-5x"></i>        
                        <h1 className="jb-title">Job Board</h1>
                    </Link>
                    <div className="jb-nav-wrapper">
                        <Route render={({ history }) => (
                            <form action="." onSubmit={(e) => this.props.onSearch(e, this.state.value, history)}>
                                <div>
                                    <i className="fa fa-search"></i>
                                    <input className="jb-search" 
                                            name="search"
                                            value={this.state.value}
                                            placeholder="Search jobs"
                                            onChange={this.handleChange}
                                            disabled={this.props.searching} />
                                </div>
                            </form>
                        )} />
                        <button onClick={this.handleClick} className="jb-btn">
                            <i className="fa fa-bars fa-2x"></i>
                        </button>
                        <nav className={`jb-nav jb-row ${this.state.navVisible}`}>
                            <Link to="/" className="jb-btn">Home</Link>
                            <Link to="/jobs" className="jb-btn">Jobs</Link>
                        </nav>
                    </div>
                </div>
            </header>
        );
    }
}

export default Header;