/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { Fragment } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import {
    Route,
    Switch,
    NavLink
} from 'react-router-dom'
import { default as NewsSwitch } from 'react-switch'
import { withRouter } from 'react-router-dom';
import AsyncSelect from 'react-select/lib/Async';
import _ from 'lodash';
import { IconContext } from 'react-icons'
import { FaRegBookmark, FaBookmark } from 'react-icons/fa'
import ReactTooltip from 'react-tooltip'
import Media from 'react-media';
import PropTypes from 'prop-types'
import { Element, Events, animateScroll as scroll, scroller} from 'react-scroll'

import HomeComponent from '../sections/HomeComponent'
import WorldComponent from '../sections/WorldComponent'
import BusinessComponent from '../sections/BusinessComponent'
import PoliticsComponent from '../sections/PoliticsComponent'
import TechnologyComponent from '../sections/TechnologyComponent'
import SportsComponent from '../sections/SportsComponent'
import DetailedComponent from '../detail/DetailedComponent'
import SearchComponent from '../search/SearchComponent'
import FavoritesComponent from '../favorites/FavoritesComponent'



const localStorage = window.localStorage
class NavbarComponent extends React.Component {
    constructor(props) {
        super(props)
        let isGuardianFromLocalStorage = JSON.parse(localStorage.getItem('isGuardian'))
        if ( isGuardianFromLocalStorage === undefined ) {
            isGuardianFromLocalStorage = true
            localStorage.setItem('isGuardian', JSON.stringify(isGuardianFromLocalStorage))
        }
        this.state = {
            searchInput: '',
            searchResults: [],
            selectedValue: '',
            isGuardian: isGuardianFromLocalStorage,
            switchVisibility: true,
            isFavoritesPage: false,
        }
        this.loadOptions = _.debounce(this.loadOptions.bind(this), 1000)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.setValue = this.setValue.bind(this)
    }
    handleChange = () => {
        this.setState((prevState) => {
            localStorage.setItem('isGuardian', JSON.stringify(!prevState.isGuardian))
            return {
                isGuardian: !prevState.isGuardian
            }
        })
    }
    handleInputChange(newValue){
        const inputValue = newValue.replace(/\W/g, '');
        this.setState({ searchInput: inputValue });
    }
    loadOptions = async (inputValue) => {
        try {
            const response = await fetch(`https://api.cognitive.microsoft.com/bing/v7.0/suggestions?&q=${inputValue}`, {
                headers: {
                    "Ocp-Apim-Subscription-Key": "3a8f2ea9fbd64bb6951fe91b149d409b"
                }
            })
            const data = await response.json()
            if (data !== undefined && data.suggestionGroups !== undefined) {
                var resultsRaw = data.suggestionGroups[0].searchSuggestions
                var results = resultsRaw.map(result => ({ label: result.displayText, value: result.displayText }))
                this.setState({ searchResults: results })
                return results
            }
        }
        catch (error) {
            return error
        }
    };
    setValue = (data) => {
        this.setState({
            selectedValue: { label: data.value, value: data.value }
        })
        this.props.history.push('/search?q=' + data.value)
    }
    goToFavorites = () => {
        this.props.history.push('/favorites')
        ReactTooltip.hide()
    }
    handleUpArrowClick = () => {
        scroller.scrollTo('navbar', {
            duration : 1700,
            smooth : true,
        })
    }
    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            let loc = this.props.history.location
            switch (loc.pathname) {
                case '/article':
                    this.setState({
                        selectedValue: '',
                        switchVisibility: false,
                        isFavoritesPage: false,
                    })
                    break;
                case '/search':
                    this.setState({
                        switchVisibility: false,
                        isFavoritesPage: false,
                    })
                    break;
                case '/favorites':
                    this.setState({
                        selectedValue: '',
                        switchVisibility: false,
                        isFavoritesPage: true,
                    })
                    break;
                default:
                    this.setState({
                        selectedValue: '',
                        switchVisibility: true,
                        isFavoritesPage: false,
                    })
            }
        }
        ReactTooltip.rebuild();
    }
    componentDidMount() {
        Events.scrollEvent.register('begin', function(to, element) {
          });
       
          Events.scrollEvent.register('end', function(to, element) {
          });
        switch (this.props.location.pathname) {
            case '/article':
                this.setState({
                    selectedValue: '',
                    switchVisibility: false,
                    isFavoritesPage: false,
                })
                break;
            case '/search':
                this.setState({
                    switchVisibility: false,
                    isFavoritesPage: false,
                })
                break;
            case '/favorites':
                this.setState({
                    selectedValue: '',
                    switchVisibility: false,
                    isFavoritesPage: true,
                })
                break;
            default:
                this.setState({
                    selectedValue: '',
                    switchVisibility: true,
                    isFavoritesPage: false,
                })
        }
    }
    componentWillUnmount() {
        Events.scrollEvent.remove('begin');
        Events.scrollEvent.remove('end');
    }
    render() {
        return (
            <Element name="navbar">
                <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="navbar-bg-color">
                    <Media queries={{
                        small: "(max-width: 325px)",
                        medium: "(min-width:326px) and (max-width: 410px)",
                        large: "(min-width: 411px)"
                    }}>
                        {matches =>
                            <Fragment>
                                <AsyncSelect
                                    value={this.state.selectedValue}
                                    loadOptions={this.loadOptions}
                                    onInputChange={this.handleInputChange}
                                    onChange={this.setValue}
                                    closeMenuOnSelect
                                    placeholder="Enter keyword .."
                                    className={matches.small ? `autosearch-small-screen` : matches.medium ? `autosearch-medium-screen` : `autosearch`}
                                />
                            </Fragment>
                        }
                    </Media>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-auto no-text-decoration">
                            <NavLink to="/" exact className="link" activeClassName="link-active">Home</NavLink>
                            <NavLink to="/world" className="link" activeClassName="link-active">World</NavLink>
                            <NavLink to="/politics" className="link" activeClassName="link-active">Politics</NavLink>
                            <NavLink to="/business" className="link" activeClassName="link-active">Business</NavLink>
                            <NavLink to="/technology" className="link" activeClassName="link-active">Technology</NavLink>
                            <NavLink to="/sports" className="link" activeClassName="link-active">Sports</NavLink>
                        </Nav>
                        {
                            this.state.isFavoritesPage
                                ?
                                <IconContext.Provider value={{ size: "18px", color: "white" }}>
                                    <FaBookmark data-tip="Bookmark" data-class="padding" /><ReactTooltip place={"bottom"} effect={"solid"} />
                                </IconContext.Provider>

                                :
                                <span className="right-padding">
                                    <IconContext.Provider value={{ size: "18px", color: "white" }} className="right-padding">
                                        <FaRegBookmark onClick={() => this.goToFavorites()} data-tip="Bookmark" data-class="padding" /><ReactTooltip place={"bottom"} effect={"solid"} />
                                    </IconContext.Provider>
                                </span>
                        }
                        {this.state.switchVisibility &&
                            <Media queries={{
                                small: "(max-width: 768px)",
                                large: "(min-width: 769px)"
                            }}>
                                {matches => (
                                    <Fragment>
                                        {matches.small &&
                                            <div className="switch">
                                                <Nav className="padding-mobile">NY Times</Nav>
                                                <Nav className="padding-mobile">
                                                    <NewsSwitch
                                                        onChange={() => this.handleChange()}
                                                        checked={this.state.isGuardian}
                                                        onColor="#028EFB"
                                                        offColor="#D9D9D9"
                                                        onHandleColor="#FFFFFF"
                                                        offHandleColor="#FFFFFF"
                                                        uncheckedIcon={false}
                                                        checkedIcon={false}
                                                        height={20}
                                                        width={40}
                                                        className="switch-position"
                                                    />
                                                </Nav>
                                                <Nav className="padding-mobile">Guardian</Nav>
                                            </div>
                                        }
                                        {matches.large &&
                                            <Nav className="switch section-right">
                                                <span className="right-padding">NY Times</span>
                                                <NewsSwitch
                                                    onChange={() => this.handleChange()}
                                                    checked={this.state.isGuardian}
                                                    onColor="#028EFB"
                                                    offColor="#D9D9D9"
                                                    onHandleColor="#FFFFFF"
                                                    offHandleColor="#FFFFFF"
                                                    uncheckedIcon={false}
                                                    checkedIcon={false}
                                                    height={20}
                                                    width={40}
                                                    className="switch-position"
                                                />
                                                <span className="left-padding">Guardian</span>
                                            </Nav>
                                        }
                                    </Fragment>
                                )}
                            </Media>
                        }
                    </Navbar.Collapse>
                </Navbar>
                <Switch>
                    <Route exact path="/" render={(props) => <HomeComponent {...props} isGuardian={this.state.isGuardian} />} />
                    <Route path="/world" render={(props) => <WorldComponent {...props} isGuardian={this.state.isGuardian} />} />
                    <Route path="/politics" render={(props) => <PoliticsComponent {...props} isGuardian={this.state.isGuardian} />} />
                    <Route path="/business" render={(props) => <BusinessComponent {...props} isGuardian={this.state.isGuardian} />} />
                    <Route path="/technology" render={(props) => <TechnologyComponent {...props} isGuardian={this.state.isGuardian} />} />
                    <Route path="/sports" render={(props) => <SportsComponent {...props} isGuardian={this.state.isGuardian} />} />
                </Switch>
                <Route path="/article" render={(props) => <DetailedComponent {...props} handleUpArrowClick={this.handleUpArrowClick} />} />
                <Route path="/search" render={(props) => <SearchComponent {...props} searchValue={this.state.selectedValue.value} />} />
                <Route path="/favorites" render={(props) => <FavoritesComponent {...props} />} />
            </Element>
        )
    }
}
NavbarComponent.propTypes = {
    history : PropTypes.object.isRequired,
    location : PropTypes.object.isRequired,
}

export default withRouter(NavbarComponent)