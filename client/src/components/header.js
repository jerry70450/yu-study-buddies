import React from 'react';

import "bootstrap/dist/css/bootstrap.min.css";
import "./header.css";

function Header(props) {
    return (
        <header>
            <nav className={"navbar border-bottom fixed-top font-weight-bold pl-0 pr-0 " + (props.white ? "navbar-dark " : "navbar-light bg-white")}>
                <div className="container">
                    <a className="navbar-brand " href="/">Study Buddies @ YU</a>
                    {/* <a class={"btn min-content " + (props.white ? "btn-outline-light" : "btn-outline-dark")} href={`courses/sections/add`} role="button">Add a Course</a> */}

                    {/* <ul className="nav justify-content-end">
                    <li className="nav-item">
                        <a className={"nav-link pr-0 " + (props.white ? "text-white" : "text-black")} href="courses">Courses</a>
                    </li>
                </ul> */}
                </div>
            </nav>
        </header>
    );
}

export default Header;