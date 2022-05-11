import { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = (props) => {
    const [nav, setNav] = useState('');
    const [value, setValue] = useState('');

    const handleClick = () => {
        setNav(nav ? '' : 'jb-nav-visible');
    };
    const handleChange = (e) => {
        setValue(e.target.value);
    };

    return (
        <header>
            <div className="jb-row">
                <Link className="jb-logo" to="/">
                    <i className="fa fa-map-o fa-5x"></i>        
                    <h1 className="jb-title">Job Board</h1>
                </Link>
                <div className="jb-nav-wrapper">
                    <form action="." onSubmit={(e) => props.onSearch(e, value)}>
                        <div>
                            <i className="fa fa-search"></i>
                            <input className="jb-search" 
                                    value={value}
                                    placeholder="Search jobs"
                                    onChange={handleChange}
                                    disabled={props.searching} 
                                    name="search" />
                        </div>
                    </form>
                    <button onClick={handleClick} className="jb-btn">
                        <i className="fa fa-bars fa-2x"></i>
                    </button>
                    <nav className={`jb-nav jb-row ${nav}`}>
                        <Link to="/" className="jb-btn">Jobs</Link>
                        <Link to="/about" className="jb-btn">About</Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}

export default Header;